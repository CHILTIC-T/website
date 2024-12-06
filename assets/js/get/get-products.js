import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  update,
  remove,
  onValue,
  child,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

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
        mostrarAlerta("Producto: " + producto.nombre + " agregado al carrito");
      })
      .catch((error) => {
        console.error("Error al agregar al carrito:", error);
      });
  }

  function agregarAFavoritos(productoId) {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Por favor, inicia sesión para agregar productos a favoritos.");
      return;
    }
    const producto = productos[productoId];
    const favRef = ref(db, `favoritos/${userId}/${producto.id}`);
    update(favRef, producto)
      .then(() => {
        mostrarAlertaFavAdd("Producto agregado a favoritos", "success");
      })
      .catch((error) => {
        console.error("Error al agregar a favoritos:", error);
        mostrarAlertaFavAdd("Error al agregar a favoritos", "error");
      });
  }

  function mostrarAlertaFavAdd(mensaje, tipo) {
    const audio = new Audio("assets/sounds/addFavorite_Sound.mp3"); // Reemplaza con tu archivo de sonido
    audio.volume = 0.7; // Sonido bajo
    audio.play();
    // Crear contenedor para la alerta
    const alerta = document.createElement("div");
    alerta.className = `alerta-favoritos position-fixed text-white rounded shadow`;
    alerta.style.right = "20px";
    alerta.style.bottom = "20px";
    alerta.style.zIndex = "1050";
    alerta.style.padding = "15px";
    alerta.style.backgroundColor = tipo === "success" ? "#28a745" : "#dc3545"; // Verde para éxito, rojo para error
    alerta.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    alerta.style.fontSize = "14px";
    alerta.innerText = mensaje;

    document.body.appendChild(alerta);
    // Remover la alerta después de 5 segundos
    setTimeout(() => {
      alerta.remove();
    }, 5000);
  }

  function reproducirSonidoFav(tipo) {
    const sonido = new Audio(
      tipo === "success"
        ? "/assets/sounds/addFavorite_Sound.mp3"
        : "sonido-error.mp3"
    ); // Cambia según el tipo
    sonido.play();
  }

  function quitarDeFavoritos(productoId) {
    const userId = localStorage.getItem("userId");
    const favRef = ref(db, `favoritos/${userId}/${productoId}`);
    remove(favRef)
      .then(() => {
        
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
    const isAuthenticated = localStorage.getItem("userId") !== null;

    for (const id in productos) {
      const producto = productos[id];
      const productoDiv = document.createElement("div");
      productoDiv.className = "col mb-4";
      productoDiv.innerHTML = `
            <div class="card">
                <img src="${producto.imagenulr}" class="card-img-top" alt="${producto.nombre}">
                <div class="card-body">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">${producto.descripcion}</p>
                    <p class="card-text">Precio: $${producto.precio}</p>
                    <p class="card-text">Stock disponible: ${producto.stock}</p> <!-- Mostrar stock -->
                    <div style="display: flex;">
                        ${isAuthenticated
          ? `<button class="btn btn-primary" onclick="agregarAlCarrito('${id}')">Agregar a carrito</button>`
          : `<a href="login.html" class="btn btn-warning">Inicia sesión para agregar</a>`
        }
                        <button class="btn btn-secondary" style="margin-left: 10px;" onclick="agregarAFavoritos('${id}')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
                                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
                            </svg>
                        </button>
                    </div>
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
        <button class="btn btn-danger" onclick="quitarDeFavoritos('${producto.id}')">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
          </svg>
        </button>
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
