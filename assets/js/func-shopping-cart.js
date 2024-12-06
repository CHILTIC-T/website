import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getDatabase, ref, get, push, update, remove } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

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
    const overlay = document.createElement("div");
    overlay.className = "overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "var(--bs-body-bg)";
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
    document.getElementById("confirmarSi").addEventListener("click", () => {
        eliminarProducto(id);
        reproducirSonido();
        mostrarMensaje("Producto eliminado del carrito", "success");
        document.body.removeChild(overlay); 
    });

    document.getElementById("confirmarNo").addEventListener("click", () => {
        document.body.removeChild(overlay); 
    });
}

function mostrarMensaje(mensaje, tipo) {    
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
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

function reproducirSonido() {
    const audio = new Audio("assets/sounds/deleteProduct_Sound.mp3"); 
    audio.play();
}

//Factura
function mostrarModalFactura(datosCompra) {
    const cuerpoModal = document.getElementById('invoiceModalBody');
    const hoy = new Date();
    
    // Obtener el descuento del atributo de datos
    const descuentoElemento = document.getElementById('discount-amount');
    const descuentoMonto = parseFloat(descuentoElemento.getAttribute('data-discount-amount')) || 0;

    // Calcular subtotal antes del descuento
    let subtotalFactura = 0;
    datosCompra.productos.forEach(producto => {
        subtotalFactura += producto.precio * producto.cantidad;
    });

    const totalFactura = subtotalFactura - descuentoMonto;

    let htmlFactura = `
        <div class="ticket" style="font-family: 'Courier New', Courier, monospace;">
            <h2 style="text-align: center; margin-bottom: 10px; font-size: 18px;"><strong>CHILTIC-T</strong></h2>
            <div style="text-align: center;">
                <p style="margin: 5px 0; font-size: 14px; line-height: 1.4;">Hidalgo 35, Centro,<br>1ra Demarcación Poniente,<br>42700 Mixquiahuala, Hgo.</p>
            </div>
            <div style="text-align: center;">
                <p style="margin: 5px 0; font-size: 14px; line-height: 1.4;">RFC: TTB040915CY9<br>Moral Régimen General de Ley</p>
            </div>
            <hr style="border: none; border-top: 1px dashed #ddd; margin: 10px 0;">
            <p style="text-align: center; margin: 5px 0; font-size: 14px;">Sucursal: Compra realizada en línea</p>
            <table style="width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 14px;">
                <thead>
                    <tr>
                        <th style="text-align: left; padding: 5px; border-bottom: 1px solid #ddd;">Producto</th>
                        <th style="text-align: left; padding: 5px; border-bottom: 1px solid #ddd;">Cant.</th>
                        <th style="text-align: left; padding: 5px; border-bottom: 1px solid #ddd;">Precio</th>
                    </tr>
                </thead>
                <tbody>
    `;

    datosCompra.productos.forEach(producto => {
        htmlFactura += `
            <tr>
                <td style="padding: 5px;">${producto.nombre}</td>
                <td style="padding: 5px;">${producto.cantidad}</td>
                <td style="padding: 5px;">$${(producto.precio * producto.cantidad).toFixed(2)}</td>
            </tr>
        `;
    });

    htmlFactura += `
                </tbody>
            </table>
            <hr style="border: none; border-top: 1px dashed #ddd; margin: 10px 0;">
            <p style="margin: 5px 0; font-size: 14px;">
                SUBTOTAL: $${subtotalFactura.toFixed(2)}<br>
                DESCUENTO: $${descuentoMonto.toFixed(2)}<br>
                TOTAL: $${totalFactura.toFixed(2)}<br>
            </p>
            <div style="text-align: center;">
                <p>${hoy.toLocaleString()}</p>
            </div>
            <div style="text-align: center;">
                <p style="margin: 5px 0; font-size: 14px;"> NO FISCAL </p>
            </div>
            <hr>
            <p style="text-align: center; word-wrap: break-word; overflow-wrap: break-word; font-size: 0.89em; color: #d0d0d0;">${datosCompra.firma}</p>
        </div>
    `;

    cuerpoModal.innerHTML = htmlFactura;

    // Mostrar el modal de factura
    const modalFactura = new bootstrap.Modal(document.getElementById('invoiceModal'));
    modalFactura.show();
}

window.descargarFacturaPDF = function () {
    const elemento = document.querySelector('.ticket');
    if (!elemento) {
        console.error('No se encontró el elemento .ticket');
        return;
    }

    // Esperar un breve momento para asegurar que el DOM esté completamente cargado
    setTimeout(() => {
        const opciones = {
            margin: 1,
            filename: 'factura.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 }, // Aumenta la escala si el texto se ve borroso
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opciones).from(elemento).save();
    }, 800); // Espera 500 ms antes de generar el PDF
};


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
        messageElement.innerHTML = '<div class="alert alert-success">Cupón aplicado correctamente</div>';
    
        // Agregar un atributo de datos para almacenar el monto del descuento
        discountElement.setAttribute('data-discount-amount', discountAmount);
        
        document.getElementById('apply-coupon-btn').disabled = true;
        renderPayPalButton();
    } else {
        currentDiscount = 0;
        discountElement.textContent = '0.00';
        discountElement.setAttribute('data-discount-amount', '0');
        totalElement.textContent = currentTotal.toFixed(2);
        messageElement.innerHTML = `<div class="alert alert-danger">${result.message}</div>`;
        
        renderPayPalButton();
    }
};

// Cristian 
function renderPayPalButton() {
    const paypalContainer = document.getElementById('paypal-button-container');
    paypalContainer.innerHTML = '';

    // Configuración del botón de PayPal
    paypal.Buttons({
        createOrder: function (data, actions) {
            const finalTotal = getCurrentTotal(); // Usa esta función para obtener el total con descuento
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: finalTotal.toFixed(2), // Usa el total final con descuento
                    }
                }]
            });
        },
        onApprove: async function (data, actions) {
            try {
                // Captura el pago
                const paymentDetails = await actions.order.capture();
                const orderId = data.orderID; // Obtiene el ID de la orden
                const userId = localStorage.getItem('userId');
                const fechaCompra = new Date().toISOString();

                // Generar la firma digital usando el orderId
                const privateKey = generatePrivateKey(32); // Clave privada
                const signature = signMessage(orderId, privateKey);

                // Obtener los productos actuales del carrito desde Firebase
                const cartRef = ref(db, 'cart/' + userId);
                const snapshot = await get(cartRef);

                if (!snapshot.exists()) {
                    throw new Error('No hay productos en el carrito');
                }

                const productosCarrito = snapshot.val();

                // Crear el objeto de compra con todos los detalles
                const compraData = {
                    fecha: fechaCompra,
                    clienteId: userId,
                    productos: Object.entries(productosCarrito).map(([id, producto]) => ({
                        id: id,
                        nombre: producto.nombre,
                        descripcion: producto.descripcion,
                        precio: producto.precio,
                        cantidad: producto.cantidad || 1
                    })),
                    firma: signature // Agregar la firma al objeto de compra
                };

                // Guardar la compra en Firebase
                const comprasRef = ref(db, 'compras/');
                await push(comprasRef, compraData);

                // Limpiar el carrito después de la compra exitosa
                await remove(cartRef);

                // Actualizar la interfaz
                document.getElementById('cart-items').innerHTML = '';
                document.getElementById("total-price").innerText = "0.00";
                document.getElementById("total-items").innerText = "0";
                total = 0;
                totalItems = 0;
                // Resetear el descuento y el cupón
                currentDiscount = 0;
                document.getElementById('discount-amount').textContent = '0.00';
                document.getElementById('coupon-input').value = '';
                document.getElementById('apply-coupon-btn').disabled = false;

                // Mostrar mensaje de éxito
                alert('¡Compra realizada con éxito! Gracias por tu compra.');
// Factura 
                // Después de la compra exitosa, mostrar modal de factura
                mostrarModalFactura(compraData);
// Factura 
            } catch (error) {
                console.error("Error al procesar la compra:", error);
                alert('Hubo un error al procesar tu compra. Por favor, intenta nuevamente.');
            }
        },
        onError: function (err) {
            console.error('Error con el pago de PayPal:', err);
            alert('Hubo un error con el pago. Por favor, intenta nuevamente.');
        }
    }).render('#paypal-button-container'); // Renderiza el botón en el contenedor
}

// Función para generar una clave privada 
function generatePrivateKey(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let privateKey = '';
    for (let i = 0; i < length; i++) {
        privateKey += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return privateKey;
}

// Función para generar una firma digital
function signMessage(message, privateKey) {
    let hash = 0;
    for (let i = 0; i < message.length; i++) {
        hash = (hash << 5) - hash + message.charCodeAt(i);
        hash |= 0; // Convertir a entero de 32 bits
    }
    return Math.abs(hash).toString(16) + privateKey;
}

// Validación de firma digital
function verifySignature(message, signature, privateKey) {
    const originalSignature = signMessage(message, privateKey);
    return originalSignature === signature;
}
// Cristian
 
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

document.addEventListener('DOMContentLoaded', function() {
    const addressText = document.getElementById('address-text');
    const addressEdit = document.getElementById('address-edit');
    const addressInput = document.getElementById('address-input');
    const editAddressBtn = document.getElementById('edit-address-btn');
    const saveAddressBtn = document.getElementById('save-address-btn');

    function toggleAddressEdit() {
        if (addressEdit.style.display === 'none') {
            addressEdit.style.display = 'flex';
            addressInput.value = addressText.textContent.trim();
            addressInput.focus();
        } else {
            addressEdit.style.display = 'none';
        }
    }

    function saveAddress() {
        const newAddress = addressInput.value.trim();
        if (newAddress) {
            addressText.textContent = newAddress;
            addressEdit.style.display = 'none';
        }
    }

    editAddressBtn.addEventListener('click', toggleAddressEdit);
    saveAddressBtn.addEventListener('click', saveAddress);

    addressInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            saveAddress();
        }
    });
});

function decrypt(data, key) {
    return data.split('').map((char, i) => 
        String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
    ).join('');
}
// Función para cargar la dirección del usuario
async function cargarDireccionUsuario() {
    const nombreUsuario = localStorage.getItem('username');
    try {
        const userRef = ref(db, 'clients/' + nombreUsuario);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            const userData = snapshot.val();
            const key = "CHILTICT"; // Clave para desencriptar
            const direccionDesencriptada = decrypt(userData.direccion, key); // Desencripta la dirección

            // Actualizar el texto de la dirección
            document.getElementById('address-text').textContent = direccionDesencriptada || 'Sin dirección';
            document.getElementById('address-input').value = direccionDesencriptada || '';
        }
    } catch (error) {
        console.error('Error al cargar la dirección:', error);
        document.getElementById('address-text').textContent = 'Error al cargar dirección';
    }
}


// Llamar a la función cuando se carga la página
document.addEventListener('DOMContentLoaded', cargarDireccionUsuario);

// Función auxiliar para obtener el total actual (asegúrate de que esta función exista)
function obtenerTotalActual() {
    const elementoTotal = document.getElementById('total-price');
    return parseFloat(elementoTotal.textContent);
}

