// Inicializar Firebase (reemplaza con tus credenciales)
const firebase = require("firebase/app");
require("firebase/firestore");

const firebaseConfig = {
  // ...
};
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

// Función para agregar un nuevo producto
async function agregarProducto(id, nombre, descripcion, precio, stock, categoriaId) {
  try {
    const docRef = await db.collection("productos").add({
      id,
      nombre,
      descripcion,
      precio,
      stock,
      categoria: db.doc(`categorias/${categoriaId}`) // Referencia a la categoría
    });
    console.log("Producto agregado con ID:", docRef.id);
  } catch (error) {
    console.error("Error al agregar producto:", error);
  }
}

// Datos de ejemplo
const productos = [
  {
    id: "prod1",
    nombre: "Té Verde Matcha",
    descripcion: "Té Matcha de alta calidad...",
    precio: 5.99,
    stock: 100,
    categoriaId: "primavera"
  },
  // ... (otros productos)
];

// Agregar los productos
productos.forEach(producto => {
  agregarProducto(producto.id, producto.nombre, producto.descripcion, producto.precio, producto.stock, producto.categoriaId);
});