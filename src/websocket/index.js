const chatController = require('../repositories/chat.repository')
const productController = require('../repositories/product.repository')
const cartController = require('../repositories/cart.repository')

async function socketManager(socket) {
    const products = await productController.getAll()
    socket.emit('products', products)
    
    const messages = await chatController.getAll()
    socket.emit('chat-messages', messages)

    socket.on('chat-message', async (msg) => {
        await chatController.create(msg)
        socket.broadcast.emit('chat-message', msg) 
    })

    socket.on('addToCart', async ({ userCart, productId }) => {
        await cartController.addProductToCart(userCart, productId)
    })
}

module.exports = socketManager