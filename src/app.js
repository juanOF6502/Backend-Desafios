const express = require('express')
const path = require('path')
const http = require('http')

const { Server } = require("socket.io")
const handlebars = require('express-handlebars')
const socketManager = require('./websocket')
const Routes = require('./routes/index')

const app = express();
const server = http.createServer(app)
const io = new Server(server)


// Configuración de Handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'handlebars')

// Middlewares
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/static', express.static(path.join(__dirname, '/public')))
app.set('json spaces', 2)

// Rutas / Router
app.use('/', Routes.home)
app.use('/api', (req, res, next) => {
    req.io = io
    next()
}, Routes.api)

// WebSocket
io.on('connection', socketManager)

// Iniciar el servidor
const port = 8080;
server.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})
