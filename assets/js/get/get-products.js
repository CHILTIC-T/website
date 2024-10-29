// TODO: Unir tabla con la tabla categoria
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
//import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

document.addEventListener('DOMContentLoaded', async () => {
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

    async function obtenerProductos() {
        const dbRef = ref(db);
        try {
            const snapshot = await get(child(dbRef, 'products'));
            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                console.log("No data available");
                return {};
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            return {};
        }
    }

    function mostrarProductos(productos) {
        const container = document.getElementById('productos-container');
        container.innerHTML = '';

        for (const id in productos) {
            const producto = productos[id];
            const productCard = `
                            <div class="col-md-6 mb-4">
                                <div class="card border-secondary bg-body rounded"> <!-- Added rounded for rounded borders -->
                                    <div class="card-body border border-secondary rounded"> <!-- Added rounded for rounded borders -->
                                        <h5 class="card-title text-primary">${producto.nombre}</h5> <!-- Added text-primary for blue text -->
                                        <p class="card-text">${producto.descripcion}</p>
                                        <p class="card-text"><strong>Precio:</strong> $${producto.precio}</p>
                                        <p class="card-text"><strong>Stock:</strong> ${producto.stock}</p>
                                        <p class="card-text"><strong>Categoría:</strong> ${producto.categoria}</p>
                                    </div>
                                </div>
                            </div>
                        `;
            container.innerHTML += productCard;
        }
    }

    const productos = await obtenerProductos();
    mostrarProductos(productos);
});

const nombreUsuario = localStorage.getItem('username');
console.log(nombreUsuario);
