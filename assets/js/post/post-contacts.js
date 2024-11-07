import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCzWKgpp0-7CDx7S1KTDDs0r6lApkG-CEY",
    authDomain: "chiltic-t.firebaseapp.com",
    databaseURL: "https://chiltic-t-default-rtdb.firebaseio.com",
    projectId: "chiltic-t",
    storageBucket: "chiltic-t.appspot.com",
    messagingSenderId: "346086628585",
    appId: "1:346086628585:web:bf2339d41f9c7f947ca478",
    measurementId: "G-JQJXRPP5GW"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function submitContactForm() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;
    
    // Formato de fecha compatible
    const date = new Date();
    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    
    // Crear el nombre de la clave personalizada
    const customKey = `Mensaje-${name}-${formattedDate}`;
    
    // Referencia a la ubicación con el nombre de clave personalizado
    const contactsRef = ref(db, `contacts/${customKey}`);
    
    // Enviar los datos a Firebase
    set(contactsRef, {
        name: name,
        email: email,
        message: message,
        date: date.toISOString() // Guardar la fecha en formato ISO para referencia
    })
    .then(() => {
        alert("Mensaje enviado exitosamente");
        document.getElementById("contact-form").reset();
    })
    .catch((error) => {
        alert("Error al enviar el mensaje: " + error.message);
    });
}

document.getElementById("submit-btn").addEventListener("click", submitContactForm);
