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

const productos = [
    {
        id: "prod1",
        nombre: "Té de Manzanilla",
        descripcion: "Té de manzanilla artesanal de Hidalgo...",
        precio: 4.99,
        stock: 120,
        categoriaId: "primavera"
    },
    {
        id: "prod2",
        nombre: "Té de Menta",
        descripcion: "Té de menta refrescante de Hidalgo...",
        precio: 5.49,
        stock: 80,
        categoriaId: "primavera"
    },
    {
        id: "prod3",
        nombre: "Té de Limón",
        descripcion: "Té de limón cítrico de Hidalgo...",
        precio: 4.99,
        stock: 100,
        categoriaId: "verano"
    },
    {
        id: "prod4",
        nombre: "Té de Jamaica",
        descripcion: "Té de jamaica afrutado de Hidalgo...",
        precio: 5.99,
        stock: 90,
        categoriaId: "verano"
    },
    {
        id: "prod5",
        nombre: "Té de Canela",
        descripcion: "Té de canela cálido de Hidalgo...",
        precio: 4.49,
        stock: 70,
        categoriaId: "otoño"
    },
    {
        id: "prod6",
        nombre: "Té de Manzana",
        descripcion: "Té de manzana dulce de Hidalgo...",
        precio: 5.99,
        stock: 60,
        categoriaId: "otoño"
    },
    {
        id: "prod7",
        nombre: "Té de Jengibre",
        descripcion: "Té de jengibre picante de Hidalgo...",
        precio: 6.49,
        stock: 50,
        categoriaId: "invierno"
    },
    {
        id: "prod8",
        nombre: "Té de Eucalipto",
        descripcion: "Té de eucalipto reconfortante de Hidalgo...",
        precio: 5.99,
        stock: 40,
        categoriaId: "invierno"
    },
    {
        id: "prod9",
        nombre: "Té de Lavanda",
        descripcion: "Té de lavanda relajante de Hidalgo...",
        precio: 6.99,
        stock: 30,
        categoriaId: "primavera"
    },
    {
        id: "prod10",
        nombre: "Té de Rosas",
        descripcion: "Té de rosas aromático de Hidalgo...",
        precio: 7.49,
        stock: 20,
        categoriaId: "verano"
    },
    {
        id: "prod11",
        nombre: "Té de Hinojo",
        descripcion: "Té de hinojo digestivo de Hidalgo...",
        precio: 5.49,
        stock: 25,
        categoriaId: "otoño"
    },
    {
        id: "prod12",
        nombre: "Té de Anís",
        descripcion: "Té de anís dulce de Hidalgo...",
        precio: 4.99,
        stock: 35,
        categoriaId: "invierno"
    }
];

productos.forEach(producto => {
    agregarProducto(producto.id, producto.nombre, producto.descripcion, producto.precio, producto.stock, producto.categoriaId);
});
