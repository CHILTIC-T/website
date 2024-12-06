import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";

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
const storage = getStorage(app);
const username = localStorage.getItem('username'); 

async function loadUserInfo() {
    if (!username) {
        console.error("No username found in localStorage.");
        alert("No se encontró el nombre de usuario en localStorage.");
        return;
    }
    
    try {
        // Obtener los datos del usuario desde la colección `clients`
        const userRef = ref(db, 'clients/' + username);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
            const user = snapshot.val();
            
            document.getElementById('user-name').textContent = user.nombre || "Nombre no disponible";
            document.getElementById('user-fname').textContent = user.usuario || "Usuario no disponible";
            document.getElementById('user-lastname').textContent = user.apellido || "Apellido no disponible";
            document.getElementById('user-email').textContent = user.correo || "Correo no disponible";
            document.getElementById('user-address').textContent = user.direccion || "Dirección no disponible";

            // Obtener las URLs de las imágenes desde `profile-details`
            const profileDetailsRef = ref(db, 'profile-details/' + username);
            const profileSnapshot = await get(profileDetailsRef);
            if (profileSnapshot.exists()) {
                const profileData = profileSnapshot.val();
                console.log("Profile data from Firebase:", profileData); // Depuración
                
                document.getElementById('profile-img').src = profileData.profileImageUrl || "https://res.cloudinary.com/dqduj2ygp/image/upload/v1731044861/skmxcuzukk56vwsiarvp.jpg";
                document.getElementById('background-img').src = profileData.backgroundImageUrl || ".https://res.cloudinary.com/dqduj2ygp/image/upload/v1731044861/hjbzzvhupc2bevqut95e.png";
            } else {
                console.warn("No profile details found in Firebase.");
                document.getElementById('profile-img').src = "https://res.cloudinary.com/dqduj2ygp/image/upload/v1731044861/skmxcuzukk56vwsiarvp.jpg";
                document.getElementById('background-img').src = "";
            }
        } else {
            console.error("No user data found in Firebase for username:", username);
            alert('No se encontraron datos del usuario en clients.');
        }
    } catch (error) {
        console.error("Error al cargar los datos del usuario:", error);
        alert("Hubo un problema al cargar los datos del usuario.");
    }
}

// Cargar la información del usuario al iniciar la página
loadUserInfo();

document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('username'); 
    window.location.href = "login.html"; 
});
