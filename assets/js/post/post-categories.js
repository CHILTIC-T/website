import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getDatabase, ref, set, onValue, remove, get, child } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

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


const categoriasJSON = [
  {
    id: "cat1",
    nombre: "Primavera",
    descripcion: "Productos frescos y florales para la temporada de primavera",
    imagen: "https://res.cloudinary.com/dqduj2ygp/image/upload/v1730928870/blxknezsix2ccnlgjuta.png",
  },
  {
    id: "cat2",
    nombre: "Verano",
    descripcion: "Productos refrescantes para el caluroso verano",
    imagen: "https://res.cloudinary.com/dqduj2ygp/image/upload/v1730928870/x5mr99z3gbrfrlgemktl.png",
  },
  {
    id: "cat3",
    nombre: "Otoño",
    descripcion: "Aromas y sabores cálidos para el otoño",
    imagen: "https://res.cloudinary.com/dqduj2ygp/image/upload/v1730928869/rryogtoeskqagnmbxqra.png",
  },
  {
    id: "cat4",
    nombre: "Invierno",
    descripcion: "Productos cálidos y reconfortantes para el invierno",
    imagen: "https://res.cloudinary.com/dqduj2ygp/image/upload/v1730928869/dmvju2qtmeg1kwavjiot.png",
  },

 
];
async function agregarCategoria(id, nombre, descripcion, imagen) {
  try {
    await set(ref(db, "categories/" + id), {
      id,
      nombre,
      descripcion,
      imagen,
    });
  } catch (error) {
  }
}

async function eliminarCategoria(id) {
  try {
    await remove(ref(db, "categories/" + id));
  } catch (error) {
  }
}

async function sincronizarCategorias() {
  const dbRef = ref(db, "categories");
  const snapshot = await get(dbRef);
  const categoriasFirebase = snapshot.exists() ? snapshot.val() : {};
  const idsJSON = categoriasJSON.map(categoria => categoria.id);

  for (const id in categoriasFirebase) {
    if (!idsJSON.includes(id)) {
      await eliminarCategoria(id);
    }
  }


  categoriasJSON.forEach((categoria) => {
    agregarCategoria(
      categoria.id,
      categoria.nombre,
      categoria.descripcion,
      categoria.imagen
    );
  });


  const snapshotUpdated = await get(dbRef); 
  if (snapshotUpdated.exists()) {
    actualizarDOMCategorias(snapshotUpdated.val());
  }
}
function escucharCambiosCategorias() {
  const dbRef = ref(db, "categories");
  onValue(dbRef, (snapshot) => {
    const categorias = snapshot.val();
    actualizarDOMCategorias(categorias);
  });
}

function actualizarDOMCategorias(categorias) {
  const container = document.getElementById("categorias-container");
  if (!container) return;
  container.innerHTML = "";

  for (const id in categorias) {
    const categoria = categorias[id];
    const categoryCard = `
      <div class="col-md-3 mb-4">
        <div class="card text-center shadow">
          <img src="${categoria.imagen}" class="card-img-top" alt="${categoria.nombre}">
          <div class="card-body">
            <h5 class="card-title">${categoria.nombre}</h5>
            <p class="text-muted">${categoria.descripcion}</p>
          </div>
        </div>
      </div>
    `;
    container.innerHTML += categoryCard;
  }
}

sincronizarCategorias();
escucharCambiosCategorias();