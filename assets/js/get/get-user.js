//TODO: Integrar un modelo de encriptacion para contraseñas
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

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

document.getElementById("loginuser").addEventListener('click', function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  get(ref(db, 'clients/' + username)).then((snapshot) => {
    if (snapshot.exists()) {
      const user = snapshot.val();
      if (user.contraseña === password) {
        window.location.href = "products.html";
        localStorage.setItem('username', username);
      } else {
        alert('Contraseña incorrecta');
      }
    } else {
      alert('Usuario no encontrado');
    }
  }).catch((error) => {
    console.error(error);
    alert('Error al consultar la base de datos');
  });
});