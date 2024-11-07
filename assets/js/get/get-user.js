//TODO: Integrar un modelo de encriptacion para contraseñas
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

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

document.getElementById("loginuser").addEventListener('click', function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  get(ref(db, 'clients/' + username)).then((snapshot) => {
    if (snapshot.exists()) {
      const user = snapshot.val();
      if (user.contraseña === password) {
        localStorage.setItem('userId', username); 
        window.location.href = "index.html";
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