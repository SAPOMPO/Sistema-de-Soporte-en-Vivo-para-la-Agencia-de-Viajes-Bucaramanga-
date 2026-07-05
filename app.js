import { db } from "./firebase.js";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

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
    snapshot.forEach((doc) => {
        const data = doc.data();
        const div = document.createElement("div");
        div.className = "resena-card";
        div.innerHTML = `<p>${data.texto}</p>`;
        muro.appendChild(div);
    });
});