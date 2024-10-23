// Import the functions you need from the SDKs you need
// TODO: Llamr esta conexion a todos los metodos de la aplicacion
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDo2eB4E1oEyKjKvGrsHZ8KefRXexV4Vl4",
    authDomain: "intergrador-b6e38.firebaseapp.com",
    databaseURL: "https://intergrador-b6e38-default-rtdb.firebaseio.com",
    projectId: "intergrador-b6e38",
    storageBucket: "intergrador-b6e38.appspot.com",
    messagingSenderId: "578891813083",
    appId: "1:578891813083:web:ec02ba57481c2b5023fcfe"
};


const app = initializeApp(firebaseConfig);

export { app };