//TODO: Integrar un modelo de encriptacion para contraseñas
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCk7U1CKIcbGrg9aDF9ai2fOb6ZgHxUO-o",
    authDomain: "integrador-8daeb.firebaseapp.com",
    projectId: "integrador-8daeb",
    storageBucket: "integrador-8daeb.appspot.com",
    messagingSenderId: "111981913559",
    appId: "1:111981913559:web:db2151f034a24d8a2d5792",
    measurementId: "G-EN1B6JL729"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const form = document.getElementById('myForm');

document.getElementById("adduser").addEventListener('click', function (e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const direccion = document.getElementById('direccion').value;
    const correo = document.getElementById('correo').value;
    const contraseña = document.getElementById('contraseña').value;
    const username = document.getElementById('nombreusuario').value;

    set(ref(db, 'clients/' + username), {
        nombre: nombre,
        direccion: direccion,
        apellido: apellido,
        correo: correo,
        usuario: username,
        contraseña: contraseña
    });

    alert("Singup Successful!, Now you can login");
});