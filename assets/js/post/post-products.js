// Inicializar Firebase (reemplaza con tus credenciales)
const firebase = require("firebase/app");
require("firebase/firestore");

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