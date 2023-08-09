const chatManager = require('../managers/chat.manager')
const productManager = require('../managers/product.manager')
const cartManager = require('../managers/cart.manager')

async function socketManager(socket) {
    console.log(`Cliente conectado: ${socket.id}`)

    const products = await productManager.getProducts()
    socket.emit('products', products)
    
    const messages = await chatManager.getAllMessages()
    socket.emit('chat-messages', messages)

    socket.on('chat-message', async (msg) => {
        await chatManager.createMessage(msg)
        socket.broadcast.emit('chat-message', msg) 
    })

    socket.on('addToCart', async ({ userId, productId }) => {
        await cartManager.addProductCart(userId, productId)
    })

    socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`)
    })
}

module.exports = socketManager;