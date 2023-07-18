const socket = io()

socket.on('connect', () => {
    console.log(`Cliente conectado: ${socket.id}`)
})

// Cuando se reciban los productos iniciales
socket.on('products', (products) => {
    updateUI(products)
});

  // Cuando se agregue un nuevo producto
socket.on('productAdded', (product) => {
    addProductToUI(product)
})

  // Cuando se elimine un producto
socket.on('productDeleted', (pid) => {
    // Elimina el producto de la interfaz de usuario
    deleteProductFromUI(pid)
});

socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`)
})



