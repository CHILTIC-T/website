import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { collection, getFirestore, getDocs, where } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore-compat.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

async function authenticateUser(email, password) {
    try {
        await signInWithEmailAndPassword(auth, email, password);

        // Verificar si el usuario existe en la colección "users" de Firestore
        const usersCollection = collection(db, "clients");
        const q = query(usersCollection, where("email", "==", email));
        const querySnapshot = await getDocs(q);


        if (querySnapshot.empty) {
            console.error("Usuario no encontrado");
            return false;
        } else {
            // El usuario existe, permitir el acceso
            console.log("Autenticación exitosa");
            return true;
        }
    } catch (error) {
        console.error("Error al autenticar:", error);
        return false;
    }
}

document.getElementById("loginuser").addEventListener('click', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    authenticateUser(email, password)
        .then(isAuthenticated => {
            if (isAuthenticated) {
                // Redirigir a la página principal o mostrar el contenido protegido
                console.log("Redireccionando a la página principal");
            } else {
                // Mostrar un mensaje de error
                console.error("Autenticación fallida");
            }
        });

});