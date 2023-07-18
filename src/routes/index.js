const {Router} = require('express')
const ProductRouter = require('./api/products.router')
const CarritoRouter = require('./api/carts.router')
const HomeRoutes = require('./home.router')

const api = Router()

api.use('/products', ProductRouter)
api.use('/carts', CarritoRouter)

const home = Router()

home.use('/', HomeRoutes)
home.use('/realtimeproducts', HomeRoutes)


module.exports = {
    api,
    home
}