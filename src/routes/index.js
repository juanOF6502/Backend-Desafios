const {Router} = require('express')
const ProductRouter = require('./api/products.router')
const CarritoRouter = require('./api/carts.router')
const HomeRoutes = require('./home.router')
const LoginRoutes = require('./login.router')

const api = Router()

api.use('/products', ProductRouter)
api.use('/carts', CarritoRouter)

const home = Router()

home.use('/', HomeRoutes)
home.use('/', LoginRoutes)

module.exports = {
    api,
    home
}