import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { 
    getDatabase, 
    ref, 
    get,
    update
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

// Configuración de Firebase
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

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Usuario específico que queremos mostrar
const nombreUsuario = localStorage.getItem('username');
//const nombreUsuario = localStorage.getItem( 'username');


// Variables globales para mantener el estado
let currentUserData = null;
let isEditMode = false;

// Elementos del DOM
const form = document.getElementById('profileForm');
const loadingElement = document.getElementById('loading');
const buttonGroup = document.getElementById('buttonGroup');

// Función para cargar los datos del usuario
async function cargarDatosUsuario() {
    try {
        const userRef = ref(db, 'clients/' + nombreUsuario);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            currentUserData = snapshot.val();
            actualizarInterfaz(currentUserData);
        } else {
            alert('Usuario no encontrado');
        }
    } catch (error) {
        console.error('Error al cargar datos:', error);
        alert('Error al cargar los datos: ' + error.message);
    } finally {
        loadingElement.style.display = 'none';
    }
}

// Función para actualizar la interfaz con los datos
function actualizarInterfaz(userData) {
    document.getElementById('profileName').textContent = `${userData.nombre} ${userData.apellido}`;
    document.getElementById('nombre').value = userData.nombre || '';
    document.getElementById('apellido').value = userData.apellido || '';
    document.getElementById('correo').value = userData.correo || '';
    document.getElementById('direccion').value = userData.direccion || '';
    document.getElementById('usuario').value = userData.usuario || '';
}

// Función para toggle modo edición
window.toggleEditMode = function() {
    isEditMode = !isEditMode;
    const inputs = form.getElementsByTagName('input');
    
    for(let input of inputs) {
        if(input.id !== 'usuario') { // El usuario no se puede editar
            input.readOnly = !isEditMode;
        }
    }
    
    buttonGroup.style.display = isEditMode ? 'block' : 'none';
}

// Función para cancelar la edición
window.cancelEdit = function() {
    isEditMode = false;
    actualizarInterfaz(currentUserData);

    // Desactivar los campos de entrada
    const inputs = form.getElementsByTagName('input');
    for (let input of inputs) {
        input.readOnly = true;
    }

    // Ocultar el grupo de botones
    buttonGroup.style.display = 'none';
};

// Manejar el envío del formulario
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!isEditMode) return;

    const updates = {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        correo: document.getElementById('correo').value,
        direccion: document.getElementById('direccion').value,
        usuario: currentUserData.usuario
    };

    try {
        loadingElement.style.display = 'flex';
        await update(ref(db, 'clients/' + nombreUsuario), updates);
        currentUserData = updates;
        alert('Perfil actualizado exitosamente');
        toggleEditMode();
    } catch (error) {
        console.error('Error al actualizar:', error);
        alert('Error al actualizar el perfil: ' + error.message);
    } finally {
        loadingElement.style.display = 'none';
    }
});

// Cargar datos cuando se inicia la página
document.addEventListener('DOMContentLoaded', cargarDatosUsuario);