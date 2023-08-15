(async () => {
    const path = require('path')
    const http = require('http')

    const express = require('express')
    const handlebars = require('express-handlebars')
    const { Server } = require("socket.io")
    const mongoose = require('mongoose')
    require('dotenv').config();

    const Routes = require('./routes/index')
    const socketManager = require('./websocket')

    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@ecommerce.uh8azfr.mongodb.net/ecommerce?retryWrites=true&w=majority`)
        
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
        server.listen(process.env.PORT, () => {
            console.log(`Server listening at http://localhost:${process.env.PORT}`)
        })
        
        console.log('Connected to database')
    } catch (error) {
        console.log('Error connecting to database:', error)
    }
})()