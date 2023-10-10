const {Router} = require('express')

const ProductRouter = require('./api/products.router')
const CarritoRouter = require('./api/carts.router')
const jwtRoutes = require('./api/auth.router')
const sessionRoutes = require('./api/session.router')
const loggerRoutes = require('./api/logger.router')
const HomeRoutes = require('./home.router')
const LoginRoutes = require('./login.router')

const api = Router()

api.use('/products', ProductRouter)
api.use('/carts', CarritoRouter)
api.use('/sessions', sessionRoutes)
api.use('/jwtAuth', jwtRoutes)
api.use('/', loggerRoutes)

const home = Router()

home.use('/', HomeRoutes)
home.use('/', LoginRoutes)

module.exports = {
    api,
    home
}