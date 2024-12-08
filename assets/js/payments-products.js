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
            subtotal: subtotal,
            productoId: id // Guardar el ID del producto para actualizar el stock más tarde
        });
    }

    // Generar el ID único de la compra
    const paymentRefId = `${userId}-${Date.now()}`;
    const paymentRef = ref(db, `Payments/${paymentRefId}`);
    
    // Guardar la compra en Firebase
    await set(paymentRef, {
        userId: userId,
        productos: productos,
        total: total,
        fecha: new Date().toISOString()
    });
    
    localStorage.setItem('paymentId', paymentRefId); // Guardar el ID de pago en localStorage

    localStorage.setItem('orderSummary', JSON.stringify({ productos, total }));
    window.location.href = "pricing.html";

    for (const producto of productos) {
        const productRef = ref(db, `products/${producto.productoId}`);
        const productSnapshot = await get(productRef);
        
        if (productSnapshot.exists()) {
            const productData = productSnapshot.val();
            const nuevoStock = productData.stock - producto.cantidad;

            await set(productRef, {
                ...productData, // Conservar los demás campos como "nombre", "descripcion", etc.
                stock: nuevoStock // Actualizar el stock
            });
        }
    }
}
