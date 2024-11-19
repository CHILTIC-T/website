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
async function agregarProducto(id, imagenulr, nombre, descripcion, precio, stock, categoriaId) {
    try {
        await set(ref(db, 'products/' + id), {
            id,
            imagenulr,
            nombre,
            descripcion,
            precio,
            stock,
            categoria: categoriaId
        });
    } catch (error) {
        console.error("Error al agregar producto:", error);
    }
}

const productos = [
    {
        id: "prod1",
        imagenulr: "https://res.cloudinary.com/dqduj2ygp/image/upload/v1731039503/xbqnox9lef11ly9h4zsx.jpg",
        nombre: "Té de Manzanilla",
        descripcion: "Té de manzanilla artesanal de Hidalgo...",
        precio: 4.99,
        stock: 120,
        categoriaId: "primavera"
    },
    {
        id: "prod2",
        imagenulr: "https://res.cloudinary.com/dqduj2ygp/image/upload/v1731039498/c7wwqvzyrwgt5npjbpiy.jpg",
        nombre: "Té de Menta",
        descripcion: "Té de menta refrescante de Hidalgo...",
        precio: 5.49,
        stock: 80,
        categoriaId: "primavera"
    },
    {
        id: "prod3",
        imagenulr: "https://res.cloudinary.com/dqduj2ygp/image/upload/v1731039498/yzzsmexe00u3jugr6gbd.jpg",
        nombre: "Té de Limón",
        descripcion: "Té de limón cítrico de Hidalgo...",
        precio: 4.99,
        stock: 100,
        categoriaId: "verano"
    },
    {
        id: "prod4",
        imagenulr: "https://res.cloudinary.com/dqduj2ygp/image/upload/v1731039505/qmtgaqghgzlp79hsoon9.jpg",
        nombre: "Té de Jamaica",
        descripcion: "Té de jamaica afrutado de Hidalgo...",
        precio: 5.99,
        stock: 90,
        categoriaId: "verano"
    },
    {
        id: "prod5",
        imagenulr: "https://res.cloudinary.com/dqduj2ygp/image/upload/v1731039501/xhjhfsrikeyfufcuibpd.jpg",
        nombre: "Té de Canela",
        descripcion: "Té de canela cálido de Hidalgo...",
        precio: 4.49,
        stock: 70,
        categoriaId: "otoño"
    },
    {
        id: "prod6",
        imagenulr: "https://res.cloudinary.com/dqduj2ygp/image/upload/v1731039498/x0qax5dh8zntjvrd6pgl.jpg",
        nombre: "Té de Manzana",
        descripcion: "Té de manzana dulce de Hidalgo...",
        precio: 5.99,
        stock: 60,
        categoriaId: "otoño"
    },
    {
        id: "prod7",
        imagenulr: "https://res.cloudinary.com/dqduj2ygp/image/upload/v1731039501/yiygzu6ciu0glapmtmxc.jpg",
        nombre: "Té de Jengibre",
        descripcion: "Té de jengibre picante de Hidalgo...",
        precio: 6.49,
        stock: 50,
        categoriaId: "invierno"
    },
    {
        id: "prod8",
        imagenulr: "https://res.cloudinary.com/dqduj2ygp/image/upload/v1731039500/orzhj8mgujar3diaj0pu.jpg",
        nombre: "Té de Eucalipto",
        descripcion: "Té de eucalipto reconfortante de Hidalgo...",
        precio: 5.99,
        stock: 40,
        categoriaId: "invierno"
    },
    {
        id: "prod9",
        imagenulr: "https://res.cloudinary.com/dqduj2ygp/image/upload/v1731039499/lo6hjg37ptlk7lyonfdc.jpg",
        nombre: "Té de Lavanda",
        descripcion: "Té de lavanda relajante de Hidalgo...",
        precio: 6.99,
        stock: 30,
        categoriaId: "primavera"
    },
    {
        id: "prod10",
        imagenulr: "https://res.cloudinary.com/dqduj2ygp/image/upload/v1731039497/imt13qzctq64nof07faf.jpg",
        nombre: "Té de Rosas",
        descripcion: "Té de rosas aromático de Hidalgo...",
        precio: 7.49,
        stock: 20,
        categoriaId: "verano"
    },
    {
        id: "prod11",
        imagenulr: "https://res.cloudinary.com/dqduj2ygp/image/upload/v1731039503/fvrcqlrk5abvkvggmmt8.jpg",
        nombre: "Té de Hinojo",
        descripcion: "Té de hinojo digestivo de Hidalgo...",
        precio: 5.49,
        stock: 25,
        categoriaId: "otoño"
    },
    {
        id: "prod12",
        imagenulr: "https://res.cloudinary.com/dqduj2ygp/image/upload/v1731039502/gsmvzmh7njuddbfcd70v.jpg",
        nombre: "Té de Anís",
        descripcion: "Té de anís dulce de Hidalgo...",
        precio: 4.99,
        stock: 35,
        categoriaId: "invierno"
    }
];

productos.forEach(producto => {
    agregarProducto(producto.id, producto.imagenulr, producto.nombre, producto.descripcion, producto.precio, producto.stock, producto.categoriaId);

});
