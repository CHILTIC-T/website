//TODO: Integrar un modelo de encriptacion para contraseñas
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