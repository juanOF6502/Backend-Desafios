(async () => {
    const { Command } = require('commander')

    const program = new Command()

    program.option('-e, --env <env>', 'Entorno de ejecucion', 'production')
    program.parse()

    const path = require('path')
    const { env } = program.opts()

    require('dotenv').config({
        path: path.join(__dirname, env === 'production' ? '.env' : '.env.development')
    })

    const config = require('./config/config')
    const http = require('http')

    const express = require('express')
    const handlebars = require('express-handlebars')
    const { Server } = require("socket.io")
    const mongoose = require('mongoose')
    const session = require('express-session')
    const MongoStore = require('connect-mongo')
    const passport = require('passport')

    const Routes = require('./routes/index')
    const socketManager = require('./websocket')
    const initPassport = require('./config/passport.init')

    try {
        await mongoose.connect(config.MONGO_URL)
        
        const app = express()
        const server = http.createServer(app)
        const io = new Server(server)

        // Configuración de Handlebars
        app.engine('handlebars', handlebars.engine())
        app.set('views', path.join(__dirname, '/views'))
        app.set('view engine', 'handlebars')

        // Middlewares de Express
        app.use(express.urlencoded({ extended: true }))
        app.use(express.json())
        app.use('/static', express.static(path.join(__dirname, '/public')))
        app.set('json spaces', 2)

        // Configuracion de Express-Session
        app.use(session({
            secret: 's3cr3t',
            resave: true,
            saveUninitialized: true,
            store: MongoStore.create({
                mongoUrl: config.MONGO_URL,
                ttl: 3600
            })
        }))

        // Middlwares de Passport
        initPassport()
        app.use(passport.initialize())
        app.use(passport.session())


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
            console.log(`Server listening at http://localhost:${config.PORT}`)
        })
        
        console.log('Connected to database')
    } catch (error) {
        console.error('Error connecting to database:', error)
    }
})()