import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getDatabase, ref, get, child, update } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

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

    async function obtenerFavoritosPorCliente() {
        const clienteId = localStorage.getItem('username');

        if (!clienteId) {
            console.error("No se encontró el ID del cliente en localStorage.");
            return;
        }

        const dbRef = ref(db);
        try {
            // Obtener las compras del cliente
            const snapshot = await get(child(dbRef, "compras"));
            if (snapshot.exists()) {
                const compras = snapshot.val();
                const favoritos = [];

                // Iterar sobre las compras y filtrar por clienteId
                for (const id in compras) {
                    const compra = compras[id];
                    if (compra.clienteId === clienteId) {
                        // Agregar los productos a la lista de favoritos
                        compra.productos.forEach(producto => {
                            favoritos.push({
                                id: producto.id,
                                nombre: producto.nombre,
                                descripcion: producto.descripcion,
                                cantidad: producto.cantidad,
                                precio: producto.precio,
                                fecha: compra.fecha
                            });
                        });
                    }
                }

                // Mostrar los favoritos en el apartado correspondiente
                mostrarFavoritos(favoritos);
            } else {
                console.log("No hay datos de compras disponibles");
            }
        } catch (error) {
            console.error("Error al obtener los favoritos: ", error);
        }
    }

    function mostrarFavoritos(favoritos) {
        const favoritosContainer = document.getElementById("favoritos");
        favoritosContainer.innerHTML = "";

        if (favoritos.length === 0) {
            favoritosContainer.innerHTML = "<p>No tienes favoritos.</p>";
            return;
        }

        const slider = document.createElement("div");
        slider.className = "carousel slide";
        slider.setAttribute("data-bs-ride", "carousel");

        const carouselInner = document.createElement("div");
        carouselInner.className = "carousel-inner";

        for (let i = 0; i < favoritos.length; i += 4) {
            const carouselItem = document.createElement("div");
            carouselItem.className = `carousel-item ${i === 0 ? "active" : ""}`;

            const cardGroup = document.createElement("div");
            cardGroup.className = "d-flex justify-content-around"; // Usar flexbox para alinear horizontalmente

            for (let j = 0; j < 4 && (i + j) < favoritos.length; j++) {
                const favorito = favoritos[i + j];

                const card = document.createElement("div");
                card.className = "card";
                card.style.width = "18rem"; // Ancho de cada tarjeta

                const cardBody = document.createElement("div");
                cardBody.className = "card-body";

                cardBody.innerHTML = `
    <h5 class="card-title">${favorito.nombre}</h5>
    <p class="card-text">${favorito.descripcion}</p>
    <p class="card-text">Cantidad: ${favorito.cantidad}</p>
    <p class="card-text">Precio: ${favorito.precio.toFixed(2)}</p>
    <p class="card-text">Fecha: ${new Date(favorito.fecha).toLocaleDateString()}</p>
    <a href="../../products.html" class="btn btn-primary">Ir a comprar</a>`;
                card.appendChild(cardBody);
                cardGroup.appendChild(card);
            }

            carouselItem.appendChild(cardGroup);
            carouselInner.appendChild(carouselItem);
        }

        slider.appendChild(carouselInner);
        favoritosContainer.appendChild(slider);
    }

    await obtenerFavoritosPorCliente();
});

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