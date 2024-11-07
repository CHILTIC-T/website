document.addEventListener("DOMContentLoaded", () => {
    const orderSummary = JSON.parse(localStorage.getItem('orderSummary'));
    const resumenContainer = document.querySelector('.card-body');
    if (orderSummary && orderSummary.productos) {
        orderSummary.productos.forEach(producto => {
            const productElement = document.createElement('div');
            productElement.innerHTML = `
                <p><strong>Producto:</strong> ${producto.nombre}</p>
                <p><strong>Cantidad:</strong> ${producto.cantidad}</p>
                <p><strong>Precio por unidad:</strong> $${producto.precio}</p>
                <p><strong>Subtotal:</strong> $${producto.subtotal}</p>
                <hr>
            `;
            resumenContainer.appendChild(productElement);
        });

        const totalElement = document.createElement('h4');
        totalElement.innerHTML = `<strong>Total a pagar:</strong> $${orderSummary.total.toFixed(2)}`;
        resumenContainer.appendChild(totalElement);
    } else {
        resumenContainer.innerHTML = "<p>No hay productos en el resumen de compra.</p>";
    }
});