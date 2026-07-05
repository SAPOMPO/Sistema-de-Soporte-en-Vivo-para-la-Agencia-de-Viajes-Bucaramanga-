import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD7gZc0nw1puTENxejNeSaB0d3Jllt01Ac",
  authDomain: "fir-90ac4.firebaseapp.com",
  projectId: "fir-90ac4",
  storageBucket: "fir-90ac4.firebasestorage.app",
  messagingSenderId: "621219147598",
  appId: "1:621219147598:web:6c87abefcdf3655709781f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function publicarResena(texto) {
  const respuesta = await fetch(`https://www.purgomalum.com/service/plain?text=${encodeURIComponent(texto)}`);
  const textoLimpio = await respuesta.text();
  
  await addDoc(collection(db, "resenas"), {
    texto: textoLimpio,
    fecha: serverTimestamp()
  });
}

export function escucharResenas(callback) {
  const q = query(collection(db, "resenas"), orderBy("fecha", "desc"));
  onSnapshot(q, (snapshot) => {
    const datos = snapshot.docs.map(doc => doc.data());
    callback(datos);
  });
}