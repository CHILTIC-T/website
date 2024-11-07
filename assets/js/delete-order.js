import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
    import { getDatabase, ref, remove } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

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

    document.getElementById('cancelar-compra').addEventListener('click', async () => {
        const userId = localStorage.getItem('userId');
        const paymentId = localStorage.getItem('paymentId'); // Obtener el ID de pago correcto

        if (!userId || !paymentId) {
            alert("No se encontró la información de pago. Inicia sesión nuevamente.");
            window.location.href = "login.html";
            return;
        }

        const paymentRef = ref(db, `Payments/${paymentId}`);

        try {
            // Eliminar el registro de pagos en Firebase
            await remove(paymentRef);

            // Limpiar el resumen de compra y el ID de pago en localStorage
            localStorage.removeItem('orderSummary');
            localStorage.removeItem('paymentId');

            // Redirigir al carrito de compras
            alert("Compra cancelada. Redirigiendo al carrito...");
            window.location.href = "shopping-cart.html";
        } catch (error) {
            console.error("Error al cancelar la compra:", error);
            alert("Hubo un error al cancelar la compra. Por favor, intenta de nuevo.");
        }
    });