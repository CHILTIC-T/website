import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  push,
  set,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

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

async function procesarCompra() {
    const userId = localStorage.getItem('userId');
    const cartRef = ref(db, `cart/${userId}`);
    const snapshot = await get(cartRef);

    if (!snapshot.exists()) {
        alert("El carrito está vacío.");
        return;
    }

    const cartItems = snapshot.val();
    let total = 0;
    const productos = [];

    for (const id in cartItems) {
        const item = cartItems[id];
        const cantidad = item.cantidad || 1;
        const subtotal = item.precio * cantidad;
        total += subtotal;

        productos.push({
            nombre: item.nombre,
            cantidad: cantidad,
            precio: item.precio,
            subtotal: subtotal
        });
    }

    // Generar el ID único de la compra
    const paymentRefId = `${userId}-${Date.now()}`;
    const paymentRef = ref(db, `Payments/${paymentRefId}`);
    
    // Guardar en Firebase y almacenar el ID de pago en localStorage
    await set(paymentRef, {
        userId: userId,
        productos: productos,
        total: total,
        fecha: new Date().toISOString()
    });
    
    localStorage.setItem('paymentId', paymentRefId); // Guardar el ID de pago en localStorage

    // Redirigir a la página de pagos
    localStorage.setItem('orderSummary', JSON.stringify({ productos, total }));
    window.location.href = "pricing.html";
}

window.procesarCompra = procesarCompra;
