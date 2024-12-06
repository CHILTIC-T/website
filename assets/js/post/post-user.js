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

// Función de cifrado
function encrypt(data, key) {
    return data.split('').map((char, i) => 
        String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
    ).join('');
}

const form = document.getElementById('myForm');

function playSound() {
    const audio = new Audio("assets/sounds/addUser_Sound.mp3");
    audio.play();
}

document.getElementById("adduser").addEventListener('click', function (e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const direccion = document.getElementById('direccion').value;
    const correo = document.getElementById('correo').value;
    const contraseña = document.getElementById('contraseña').value;
    const username = document.getElementById('nombreusuario').value;

    const key = "CHILTICT";

    set(ref(db, 'clients/' + username), {
        nombre: encrypt(nombre, key),
        direccion: encrypt(direccion, key),
        apellido: encrypt(apellido, key),
        correo: encrypt(correo, key),
        usuario: encrypt(username, key),
        contraseña: encrypt(contraseña, key)
    });

    playSound();

    const alertContainer = document.createElement('div');
    alertContainer.className = "modal fade";
    alertContainer.id = "customAlert";
    alertContainer.tabIndex = -1;
    alertContainer.setAttribute("aria-labelledby", "customAlertLabel");
    alertContainer.setAttribute("aria-hidden", "true");
    alertContainer.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="customAlertLabel">Signup Successful!</h5>
                </div>
                <div class="modal-body">
                    Now you can login.
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" id="okButton">OK</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(alertContainer);

    const modal = new bootstrap.Modal(document.getElementById('customAlert'), {
        backdrop: 'static',
        keyboard: false
    });
    modal.show();

    document.getElementById("okButton").addEventListener('click', () => {
        modal.hide();
        window.location.href = "login.html";
    });

});
