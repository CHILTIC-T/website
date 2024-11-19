import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
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

  async function obtenerCategorias() {
    const dbRef = ref(db);
    try {
      const snapshot = await get(child(dbRef, "categories"));
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.log("No hay datos de categorías disponibles");
        return {};
      }
    } catch (error) {
      console.error("Error al obtener categorías:", error);
      return {};
    }
  }

  function mostrarCategorias(categorias) {
    const container = document.getElementById("categorias-container");
    container.innerHTML = "";

    for (const id in categorias) {
      const categoria = categorias[id];
      const categoryCard = `
                <div class="col-md-3 mb-4">
                    <div class="card text-center shadow">
                        <img src="${categoria.imagen}" class="card-img-top" alt="${categoria.nombre}" draggable="false">
                        <div class="card-body">
                            <h5 class="card-title">${categoria.nombre}</h5>
                            <p class="text-muted">${categoria.descripcion}</p>                            
                            <button class="btn btn-primary me-2"  onclick="window.location.href='\products.html';" >Ver Productos</button>
                        </div>                        
                    </div>
                </div>
            `;
      container.innerHTML += categoryCard;
    }
  }

  const categorias = await obtenerCategorias();
  mostrarCategorias(categorias);
});
