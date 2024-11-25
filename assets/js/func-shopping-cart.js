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
                <button class="btn btn-outline-danger btn-sm mt-2" onclick="eliminarProducto('${id}')">Eliminar</button>
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
    
    // Configuración del botón de PayPal
    paypal.Buttons({
        createOrder: function (data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: total.toFixed(2),
                    }
                }]
            });
        },
        onApprove: async function (data, actions) {
            try {
                // Captura el pago
                const paymentDetails = await actions.order.capture();
                const userId = localStorage.getItem('userId');
                const fechaCompra = new Date().toISOString();
                
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
    
                // Mostrar mensaje de éxito
                alert('¡Compra realizada con éxito! Gracias por tu compra.');
    
            } catch (error) {
                console.error("Error al procesar la compra:", error);
                alert('Hubo un error al procesar tu compra. Por favor, intenta nuevamente.');
            }
        },
        onError: function (err) {
            console.error('Error con el pago de PayPal:', err);
            alert('Hubo un error con el pago. Por favor, intenta nuevamente.');
        }
    }).render('#paypal-button-container');
// Renderiza el botón en el contenedor
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

// Función para cargar la dirección del usuario
async function cargarDireccionUsuario() {
    const nombreUsuario = localStorage.getItem('username');
    try {
        const userRef = ref(db, 'clients/' + nombreUsuario);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            const userData = snapshot.val();
            // Actualizar el texto de la dirección
            document.getElementById('address-text').textContent = userData.direccion || 'Sin dirección';
            document.getElementById('address-input').value = userData.direccion || '';
        }
    } catch (error) {
        console.error('Error al cargar la dirección:', error);
        document.getElementById('address-text').textContent = 'Error al cargar dirección';
    }
}

// Llamar a la función cuando se carga la página
document.addEventListener('DOMContentLoaded', cargarDireccionUsuario);