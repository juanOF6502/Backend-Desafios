const socket = io()

function addToCart(productId) {
    socket.emit('addToCart', { userId: '64db809f300e1901969ad282', productId })
}