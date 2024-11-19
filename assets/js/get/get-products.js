import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getDatabase, ref, get, update, remove, onValue, child } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

document.addEventListener("DOMContentLoaded", async () => {
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

  async function obtenerProductos() {
    const dbRef = ref(db);
    try {
      const snapshot = await get(child(dbRef, "products"));
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.log("No hay datos disponibles");
        return {};
      }
    } catch (error) {
      console.error("Error al obtener datos:", error);
      return {};
    }
  }

  function agregarAlCarrito(productoId) {
    const producto = productos[productoId];
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
        mostrarAlerta("Producto: "+ producto.nombre + " agregado al carrito");
      })
      .catch((error) => {
        console.error("Error al agregar al carrito:", error);
      });
  }
  function agregarAFavoritos(productoId) {
    const producto = productos[productoId];
    const userId = localStorage.getItem("userId");
    const favRef = ref(db, `favoritos/${userId}/${producto.id}`);
    update(favRef, producto)
      .then(() => {
        alert("Producto agregado a favoritos");
      })
      .catch((error) => {
        console.error("Error al agregar a favoritos:", error);
      });
  }

  function quitarDeFavoritos(productoId) {
    const userId = localStorage.getItem("userId");
    const favRef = ref(db, `favoritos/${userId}/${productoId}`);
    remove(favRef)
      .then(() => {
        alert("Producto eliminado de favoritos");
      })
      .catch((error) => {
        console.error("Error al eliminar de favoritos:", error);
      });
  }

  function mostrarAlerta(mensaje) {
    // Reproducir sonido discreto
    const audio = new Audio("assets/sounds/addCarShop_bell_Sound.mp3"); // Reemplaza con tu archivo de sonido
    audio.volume = 0.5; // Sonido bajo
    audio.play();

    // Crear el contenedor de la alerta
    const alerta = document.createElement("div");
    alerta.className = "alerta-carrito position-fixed border shadow";
    alerta.style.right = "20px";
    alerta.style.bottom = "20px";
    alerta.style.zIndex = "1050";
    alerta.style.padding = "15px";
    alerta.style.borderRadius = "8px";
    alerta.style.display = "flex";
    alerta.style.alignItems = "center";
    alerta.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    alerta.innerHTML = `
        <div style="flex-grow: 1; font-size: 14px;">${mensaje}</div>
        <button class="btn btn-primary btn-sm" id="irCarrito" style="margin-left: 10px;">Ir al carrito</button>
    `;

    // Añadir al cuerpo del documento
    document.body.appendChild(alerta);

    // Evento para el botón "Ir al carrito"
    document.getElementById("irCarrito").addEventListener("click", () => {
        window.location.href = "shopping-cart.html"; // Redirigir al carrito
    });

    // Ocultar la alerta después de 5 segundos
    setTimeout(() => {
        alerta.remove();
    }, 5000);
}

  function mostrarProductos(productos) {
    const container = document.getElementById("productos-container");
    container.innerHTML = "";

    for (const id in productos) {
      const producto = productos[id];
      const productoDiv = document.createElement("div");
      productoDiv.className = "col mb-4";
      productoDiv.innerHTML = `
        <div class="card">
          <img src="${producto.imagenulr}" class="card-img-top" alt="${producto.nombre}">
          <div class="card-body">
            <h5 class="card-title">${producto.nombre}</h5>
            <button class="btn btn-primary" onclick="agregarAlCarrito('${producto.id}')">Agregar al carrito</button>
            <button class="btn btn-secondary" onclick="agregarAFavoritos('${producto.id}')">Agregar a favoritos</button>
          </div>
        </div>
      `;
      container.appendChild(productoDiv);
    }
  }

  function mostrarFavoritos(favoritos) {
    const container = document.getElementById("favoritos-container");
    container.innerHTML = "";

    for (const id in favoritos) {
      const producto = favoritos[id];
      const productoDiv = document.createElement("div");
      productoDiv.className = "col mb-4";
      productoDiv.innerHTML = `
        <div class="card">
          <img src="${producto.imagenulr}" class="card-img-top" alt="${producto.nombre}">
          <div class="card-body">
            <h5 class="card-title">${producto.nombre}</h5>
            <p class="card-text">${producto.descripcion}</p>
            <p class="card-text">$${producto.precio}</p>
            <button class="btn btn-danger" onclick="quitarDeFavoritos('${producto.id}')">Quitar de favoritos</button>
          </div>
        </div>
      `;
      container.appendChild(productoDiv);
    }
  }

  function cargarFavoritos() {
    const userId = localStorage.getItem("userId");
    const favRef = ref(db, `favoritos/${userId}`);
    onValue(favRef, (snapshot) => {
      const favoritos = snapshot.val();
      mostrarFavoritos(favoritos);
    });
  }

  window.agregarAlCarrito = agregarAlCarrito;
  window.agregarAFavoritos = agregarAFavoritos;
  window.quitarDeFavoritos = quitarDeFavoritos;

  const productos = await obtenerProductos();
  mostrarProductos(productos);
  cargarFavoritos();
});
