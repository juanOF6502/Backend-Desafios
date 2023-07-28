const ProductManager = require('../managers/ProductManager')
const productManager = new ProductManager()

function socketManager(socket) {
    console.log(`Cliente conectado: ${socket.id}`)
    
    socket.on('connect', async () => {
        const products = await productManager.getProducts()
        socket.emit('products', products)
    })

    socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`)
    })

    socket.on('deleteProduct', async (productId) => {
        await productManager.deleteProduct(productId)
        const products = await productManager.getProducts()
        socket.emit('products', products)
    })
}

module.exports = socketManager;