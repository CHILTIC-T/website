import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

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
async function agregarProducto(id, nombre, descripcion, precio, stock, categoriaId) {
    try {
        await set(ref(db, 'products/' + id), {
            id,
            nombre,
            descripcion,
            precio,
            stock,
            categoria: categoriaId
        });
        console.log("Producto agregado con ID:", id);
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
    {
        id: "prod2",
        nombre: "Té Negro Assam",
        descripcion: "Té negro fuerte y robusto...",
        precio: 4.99,
        stock: 50,
        categoriaId: "invierno"
    },
    {
        id: "prod3",
        nombre: "Té Blanco Pai Mu Tan",
        descripcion: "Té blanco delicado y floral...",
        precio: 6.99,
        stock: 75,
        categoriaId: "verano"
    },
    {
        id: "prod4",
        nombre: "Té Oolong",
        descripcion: "Té semifermentado con sabor único...",
        precio: 5.49,
        stock: 60,
        categoriaId: "otoño"
    },
    {
        id: "prod5",
        nombre: "Té de Hierbas Manzanilla",
        descripcion: "Infusión de manzanilla relajante...",
        precio: 3.99,
        stock: 80,
        categoriaId: "primavera"
    },
    {
        id: "prod6",
        nombre: "Té de Frutas Hibisco",
        descripcion: "Infusión de hibisco con sabor afrutado...",
        precio: 4.49,
        stock: 90,
        categoriaId: "verano"
    }
];

productos.forEach(producto => {
    agregarProducto(producto.id, producto.nombre, producto.descripcion, producto.precio, producto.stock, producto.categoriaId);
});
