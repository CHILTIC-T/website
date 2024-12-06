// Importar módulos de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getDatabase, ref, get, child, update } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCzWKgpp0-7CDx7S1KTDDs0r6lApkG-CEY",
    authDomain: "chiltic-t.firebaseapp.com",
    databaseURL: "https://chiltic-t-default-rtdb.firebaseio.com",
    projectId: "chiltic-t",
    storageBucket: "chiltic-t.appspot.com",
    messagingSenderId: "346086628585",
    appId: "1:346086628585:web:bf2339d41f9c7f947ca478",
    measurementId: "G-JQJXRPP5GW",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let productos = []; // Declarar productos globalmente

async function obtenerProductos() {
    const dbRef = ref(db);
    try {
        const snapshot = await get(child(dbRef, "products"));
        if (snapshot.exists()) {
            productos = Object.keys(snapshot.val())
                .map((key) => ({ id: key, ...snapshot.val()[key] }));

            const productosSugeridos = productos.slice(0, 4);
            mostrarProductos(productosSugeridos);
        } else {
            console.log("No hay productos disponibles");
            mostrarError("No hay productos disponibles para mostrar.");
        }
    } catch (error) {
        console.error("Error al obtener datos:", error);
        mostrarError("Hubo un problema al cargar los productos. Intenta más tarde.");
    }
}

function mostrarProductos(productos) {
    const contenedorSugeridos = document.getElementById("sugeridos");
    contenedorSugeridos.innerHTML = ""; // Limpiar el contenido previo

    // Crear el contenedor principal para las tarjetas
    const contenedorTarjetas = document.createElement('div');
    contenedorTarjetas.classList.add('row'); // Usar la clase "row" de Bootstrap para organizar las tarjetas en filas

    productos.forEach((producto) => {
        const productoHTML = `
      <div class="col-12 col-md-3 mb-4">  <!-- col-12 en pantallas pequeñas y col-md-3 para 4 tarjetas por fila en pantallas medianas -->
        <div class="card">
                  <img src="${producto.imagenulr}" class="card-img-top" alt="${producto.nombre}">
          <div class="card-body">
            <h5 class="card-title">${producto.nombre}</h5>
            <p class="card-text">${producto.descripcion}</p>
            <p class="card-text">Precio: $${producto.precio}</p>
            <button class="btn btn-primary" onclick="agregarAlCarrito('${producto.id}')">Agregar al carrito</button>
          </div>
        </div>
      </div>
    `;
        contenedorTarjetas.innerHTML += productoHTML;
    });

    contenedorSugeridos.appendChild(contenedorTarjetas);
}

function mostrarError(mensaje) {
    const contenedorError = document.getElementById("error");
    contenedorError.innerHTML = mensaje;
}

document.addEventListener("DOMContentLoaded", obtenerProductos);

window.agregarAlCarrito = function(productoId) {
    const producto = productos.find(p => p.id === productoId); // Buscar el producto en el arreglo global
    const userId = localStorage.getItem("userId");
    const fecha = new Date();
    const dia = fecha.getDate().toString().padStart(2, "0");
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const anio = fecha.getFullYear();
    const fechaFormato = `${dia}-${mes}-${anio}`;
    const nombreProducto = producto.nombre.replace(/ /g, "_");
    const claveProducto = `${producto.id}-${nombreProducto}-${fechaFormato}`;
    const cartRef = ref(db, `cart/${userId}/${claveProducto}`);
    update(cartRef, producto)
      .then(() => {
        mostrarAlerta("Producto: " + producto.nombre + " agregado al carrito");
      })
      .catch((error) => {
        console.error("Error al agregar al carrito:", error);
      });
};