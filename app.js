import { db, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "./firebase.js";

const btnPublicar = document.getElementById("btnPublicar");
const textoResena = document.getElementById("textoResena");
const muro = document.getElementById("muro");

async function filtrarTexto(texto) {
    const res = await fetch(`https://www.purgomalum.com/service/plain?text=${encodeURIComponent(texto)}`);
    return await res.text();
}

btnPublicar.addEventListener("click", async () => {
    const texto = textoResena.value.trim();

    if (texto.length < 10) {
        alert("El comentario debe tener al menos 10 caracteres.");
        return;
    }

    btnPublicar.disabled = true;
    let contador = 5;
    const textoOriginal = btnPublicar.innerText;
    
    const intervalo = setInterval(() => {
        contador--;
        btnPublicar.innerText = `Espere ${contador}s...`;
        if (contador <= 0) {
            clearInterval(intervalo);
            btnPublicar.disabled = false;
            btnPublicar.innerText = textoOriginal;
        }
    }, 1000);

    try {
        const textoLimpio = await filtrarTexto(texto);
        await addDoc(collection(db, "resenas"), {
            texto: textoLimpio,
            fecha: serverTimestamp()
        });
        textoResena.value = "";
    } catch (error) {
        alert("Error al enviar, intente de nuevo.");
        btnPublicar.disabled = false;
        btnPublicar.innerText = textoOriginal;
        clearInterval(intervalo);
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