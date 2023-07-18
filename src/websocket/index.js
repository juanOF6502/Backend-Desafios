
let products = []

function socketManager(socket){
    socket.on('connect', () => {
        console.log(`Cliente conectado: ${socket.id}`)
        socket.emit('products', products)
    })
    


    socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`)
    })
}

module.exports = socketManager


