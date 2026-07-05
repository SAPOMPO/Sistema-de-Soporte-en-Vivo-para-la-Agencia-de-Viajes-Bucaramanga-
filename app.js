import { db } from "./firebase.js";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const btnPublicar = document.getElementById("btnPublicar");
const textoResena = document.getElementById("textoResena");
const muro = document.getElementById("muro");
const mensajeEstado = document.getElementById("mensajeEstado");

async function filtrarTexto(texto) {
    try {
        const res = await fetch(`https://www.purgomalum.com/service/plain?text=${encodeURIComponent(texto)}`);
        return await res.text();
    } catch (e) {
        throw new Error("No se pudo conectar con el filtro de contenido.");
    }
}

btnPublicar.addEventListener("click", async () => {
    const texto = textoResena.value.trim();

    if (texto.length < 10) {
        mensajeEstado.innerText = "Error: La reseña es muy corta (mínimo 10 caracteres).";
        mensajeEstado.style.color = "red";
        return;
    }

    btnPublicar.disabled = true;
    mensajeEstado.innerText = "Enviando reseña...";
    mensajeEstado.style.color = "blue";

    try {
        const textoLimpio = await filtrarTexto(texto);
        await addDoc(collection(db, "resenas"), {
            texto: textoLimpio,
            fecha: serverTimestamp()
        });
        
        mensajeEstado.innerText = "¡Reseña enviada con éxito!";
        mensajeEstado.style.color = "green";
        textoResena.value = "";
        
        setTimeout(() => { mensajeEstado.innerText = ""; }, 3000);
    } catch (error) {
        mensajeEstado.innerText = "Error al enviar: " + error.message;
        mensajeEstado.style.color = "red";
    } finally {
        btnPublicar.disabled = false;
    }
});

const q = query(collection(db, "resenas"), orderBy("fecha", "desc"));
onSnapshot(q, (snapshot) => {
    muro.innerHTML = "";
    snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const div = document.createElement("div");
        div.className = "resena-card";
        
        div.innerHTML = `
            <p style="flex-grow: 1; margin-right: 15px;">${data.texto}</p>
            <button class="btn-eliminar">Eliminar</button>
        `;
        
        div.querySelector(".btn-eliminar").addEventListener("click", async () => {
            const password = prompt("Ingrese la contraseña de administrador:");
            if (password === "ADMIN_NOVATECH_2026") {
                try {
                    await deleteDoc(doc(db, "resenas", docSnap.id));
                } catch (e) {
                    alert("Error al eliminar el documento.");
                }
            } else if (password !== null) {
                alert("Acceso Denegado");
            }
        });
        
        muro.appendChild(div);
    });
});