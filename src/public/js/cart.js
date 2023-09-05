const socket = io()

function addToCart(userCart,productId) {
    socket.emit('addToCart', { userCart, productId })
}