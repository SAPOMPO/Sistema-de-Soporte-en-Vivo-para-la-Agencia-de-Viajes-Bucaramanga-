import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyD7gZc0nw1puTENxejNeSaB0d3Jllt01Ac",
    authDomain: "fir-90ac4.firebaseapp.com",
    projectId: "fir-90ac4",
    storageBucket: "fir-90ac4.appspot.com",
    messagingSenderId: "621219147598",
    appId: "1:621219147598:web:6c87abefcdf3655709781f"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);