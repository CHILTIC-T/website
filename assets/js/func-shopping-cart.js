import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getDatabase, ref, get, update, remove } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

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
let total = 0;
let totalItems = 0;

window.actualizarCantidad = function actualizarCantidad(id, operacion, precio) {
    const userId = localStorage.getItem('userId');
    const itemRef = ref(db, 'cart/' + userId + '/' + id);

    const cantidadElement = document.getElementById(`cantidad-${id}`);
    let cantidadActual = parseInt(cantidadElement.textContent) || 0;

    if (operacion === 'incrementar') {
        cantidadActual++;
        totalItems++;
    } else if (operacion === 'decrementar' && cantidadActual > 1) {
        cantidadActual--;
        totalItems--;
    }

    update(itemRef, { cantidad: cantidadActual })
        .then(() => {
            cantidadElement.textContent = cantidadActual;
            actualizarTotal();
        })
        .catch((error) => console.error("Error al actualizar cantidad:", error));
};

window.eliminarProducto = function eliminarProducto(id) {
    const userId = localStorage.getItem('userId');
    const itemRef = ref(db, 'cart/' + userId + '/' + id);
    
    remove(itemRef)
        .then(() => {
            obtenerCarrito();
        })
        .catch((error) => console.error("Error al eliminar el producto:", error));
};

window.confirmarEliminacion = function confirmarEliminacion(id,nombreProducto) {
    // Crear el contenedor del mensaje emergente
    const overlay = document.createElement("div");
    overlay.className = "overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.zIndex = "1050";

    const popup = document.createElement("div");
    popup.className = "popup  p-4 rounded shadow";
    popup.style.width = "300px";
    popup.style.textAlign = "center";

    popup.innerHTML = `
        <h5>¿Desea eliminar el producto: ${nombreProducto}?</h5>
        <div class="mt-3">
            <button class="btn btn-danger btn-sm" id="confirmarSi">Sí</button>
            <button class="btn btn-secondary btn-sm" id="confirmarNo">No</button>
        </div>
    `;

    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    // Agregar funcionalidad a los botones
    document.getElementById("confirmarSi").addEventListener("click", () => {
        eliminarProducto(id);
        reproducirSonido();
        mostrarMensaje("Producto eliminado del carrito", "success");
        document.body.removeChild(overlay); // Cerrar el mensaje emergente
    });

    document.getElementById("confirmarNo").addEventListener("click", () => {
        document.body.removeChild(overlay); // Cerrar el mensaje emergente
    });
}

function mostrarMensaje(mensaje, tipo) {
    // Crear el contenedor del mensaje discreto
    const alerta = document.createElement("div");
    alerta.className = `alerta-carrito position-fixed text-white rounded shadow`;
    alerta.style.right = "20px";
    alerta.style.bottom = "20px";
    alerta.style.zIndex = "1050";
    alerta.style.padding = "15px";
    alerta.style.backgroundColor = tipo === "success" ? "#28a745" : "#dc3545"; // Verde o rojo
    alerta.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    alerta.style.fontSize = "14px";
    alerta.innerText = mensaje;

    document.body.appendChild(alerta);

    // Ocultar el mensaje después de 3 segundos
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

function reproducirSonido() {
    const audio = new Audio("assets/sounds/deleteProduct_Sound.mp3"); // Ruta del archivo de sonido
    audio.play();
}

function actualizarTotal() {
    const userId = localStorage.getItem('userId');
    const cartRef = ref(db, 'cart/' + userId);
    get(cartRef).then(snapshot => {
        total = 0;
        totalItems = 0;
        if (snapshot.exists()) {
            const cartItems = snapshot.val();
            for (const id in cartItems) {
                const producto = cartItems[id];
                const cantidad = producto.cantidad || 1;
                total += producto.precio * cantidad;
                totalItems += cantidad;
            }
        }
        document.getElementById("total-price").innerText = total.toFixed(2);
        document.getElementById("total-items").innerText = totalItems;
    });
}

async function obtenerCarrito() {
    const userId = localStorage.getItem('userId');
    const cartRef = ref(db, 'cart/' + userId);
    const snapshot = await get(cartRef);

    if (snapshot.exists()) {
        const cartItems = snapshot.val();
        mostrarProductosCarrito(cartItems);
    } else {        
        const cartContainer = document.getElementById('cart-items');
        cartContainer.innerHTML = ''; 
        document.getElementById("total-price").innerText = "0.00";
        document.getElementById("total-items").innerText = "0";
        total = 0;
        totalItems = 0;
    }
}

function mostrarProductosCarrito(productos) {
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = ''; 

    for (const id in productos) {
        const producto = productos[id];
        const cantidad = producto.cantidad || 1; 
        cartContainer.innerHTML += `
            <div class="cart-item-container">
                <h5>${producto.nombre}</h5>
                <p>${producto.descripcion}</p>
                <p><strong>Precio:</strong> $${producto.precio}</p>
                <div>
                    <button class="btn btn-outline-secondary btn-sm" onclick="actualizarCantidad('${id}', 'decrementar', ${producto.precio})">-</button>
                    <span id="cantidad-${id}">${cantidad}</span>
                    <button class="btn btn-outline-secondary btn-sm" onclick="actualizarCantidad('${id}', 'incrementar', ${producto.precio})">+</button>
                </div>
                <button class="btn btn-outline-danger btn-sm mt-2" onclick="confirmarEliminacion('${id}','${producto.nombre}')">Eliminar</button>
            </div>
        `;
    }
    actualizarTotal();
}

// Cristian

let currentDiscount = 0;

function getCurrentTotal() {
    const totalElement = document.getElementById('total-price');
    return parseFloat(totalElement.textContent);
}


function validateCoupon(code) {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    
    const coupons = {
        'PRIMAVERA': {
            discount: 0.05,
            valid: (month === 3 && day >= 21) || (month === 4) || (month === 5) || (month === 6 && day <= 20)
        },
        'VERANO': {
            discount: 0.10,
            valid: (month === 6 && day >= 21) || (month === 7) || (month === 8) || (month === 9 && day <= 20)
        },
        'OTOÑO': {
            discount: 0.125,
            valid: (month === 9 && day >= 21) || (month === 10) || (month === 11) || (month === 12 && day <= 20)
        },
        'INVIERNO': {
            discount: 0.15,
            valid: (month === 12 && day >= 21) || (month === 1) || (month === 2) || (month === 3 && day <= 20)
        }
    };

    const coupon = coupons[code.toUpperCase()];
    if (!coupon) return { valid: false, message: 'Cupón inválido' };
    if (!coupon.valid) return { valid: false, message: 'Cupón fuera de temporada' };
    return { valid: true, discount: coupon.discount };
}


window.applyCoupon = function() {
    const couponCode = document.getElementById('coupon-input').value;
    const result = validateCoupon(couponCode);
    const messageElement = document.getElementById('coupon-message');
    const totalElement = document.getElementById('total-price');
    const discountElement = document.getElementById('discount-amount');
    
    const currentTotal = parseFloat(totalElement.textContent);
    
    if (result.valid) {
        currentDiscount = result.discount;
        const discountAmount = currentTotal * currentDiscount;
        const finalTotal = currentTotal - discountAmount;
        
        discountElement.textContent = discountAmount.toFixed(2);
        totalElement.textContent = finalTotal.toFixed(2);
        messageElement.innerHTML = `<div class="alert alert-success">Cupón aplicado correctamente</div>`;
        
        
        renderPayPalButton();
    } else {
        currentDiscount = 0;
        discountElement.textContent = '0.00';
        totalElement.textContent = currentTotal.toFixed(2);
        messageElement.innerHTML = `<div class="alert alert-danger">${result.message}</div>`;
        
       
        renderPayPalButton();
    }
};


function renderPayPalButton() {
    const paypalContainer = document.getElementById('paypal-button-container');
    paypalContainer.innerHTML = ''; 
    
    paypal.Buttons({
        createOrder: function(data, actions) {
            const finalAmount = getCurrentTotal();
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: finalAmount.toFixed(2) 
                    }
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(orderData) {
                console.log('Capture result', orderData);
                alert('Transacción completada. ID: ' + orderData.id);
            });
        },
        onError: function(err) {
            console.error('Error en la transacción:', err);
            alert('Ocurrió un error durante la transacción');
        }
    }).render('#paypal-button-container');
}


document.addEventListener('DOMContentLoaded', function() {
    renderPayPalButton();
});
        
document.addEventListener('DOMContentLoaded', obtenerCarrito);

document.getElementById('terms-checkbox').addEventListener('change', function() {
    const paypalContainer = document.getElementById('paypal-button-container');
    if (this.checked) {
        paypalContainer.classList.remove('disabled');
    } else {
        paypalContainer.classList.add('disabled');
    }
});

let timeoutId; // Variable para almacenar el timeout

function iniciarTemporizadorLimpieza() {
    // Cancela cualquier temporizador activo
    if (timeoutId) clearTimeout(timeoutId);

    // Establece un nuevo temporizador para limpiar el carrito después de 1 minuto
    timeoutId = setTimeout(() => {
        limpiarCarrito();
        mostrarMensaje("El carrito se ha vaciado por inactividad", "danger");
    }, 1200000); // 60000 ms = 1 minuto
}

function limpiarCarrito() {
    const userId = localStorage.getItem('userId');
    const cartRef = ref(db, 'cart/' + userId);
    
    // Limpia el carrito en la base de datos
    remove(cartRef)
        .then(() => {
            // Limpia la interfaz del carrito
            const cartContainer = document.getElementById('cart-items');
            cartContainer.innerHTML = ''; 
            document.getElementById("total-price").innerText = "0.00";
            document.getElementById("total-items").innerText = "0";
            total = 0;
            totalItems = 0;
        })
        .catch((error) => console.error("Error al limpiar el carrito:", error));
}

// Llama a la función de temporizador cada vez que se agrega un producto
function reiniciarTemporizadorAlAgregarProducto() {
    iniciarTemporizadorLimpieza();
}

// Agrega esta línea para iniciar el temporizador al cargar el carrito inicialmente
document.addEventListener('DOMContentLoaded', () => {
    obtenerCarrito();
    iniciarTemporizadorLimpieza();
});
