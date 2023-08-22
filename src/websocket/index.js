const chatManagerMDB = require('../managers/chat.manager')
const productManagerMDB = require('../managers/product.manager')
const cartManagerMDB = require('../managers/cart.manager')

async function socketManager(socket) {
    const products = await productManagerMDB.getProducts()
    socket.emit('products', products)
    
    const messages = await chatManagerMDB.getAllMessages()
    socket.emit('chat-messages', messages)

    socket.on('chat-message', async (msg) => {
        await chatManagerMDB.createMessage(msg)
        socket.broadcast.emit('chat-message', msg) 
    })

    socket.on('addToCart', async ({ userId, productId }) => {
        await cartManagerMDB.addProductToCart(userId, productId)
    })
}

module.exports = socketManager;