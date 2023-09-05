const {Router} = require('express')

const ProductRouter = require('./api/products.router')
const CarritoRouter = require('./api/carts.router')
const jwtRoutes = require('../routes/api/auth.router')
const sessionRoutes = require('../routes/api/session.router')
const HomeRoutes = require('./home.router')
const LoginRoutes = require('./login.router')

const jwtVerifyAuthToken  = require('../middlewares/jwt.auth.middleware')

const api = Router()

api.use('/products', jwtVerifyAuthToken, ProductRouter)
api.use('/carts',jwtVerifyAuthToken, CarritoRouter)
api.use('/sessions', sessionRoutes)
api.use('/jwtAuth', jwtRoutes)

const home = Router()

home.use('/', HomeRoutes)
home.use('/', LoginRoutes)

module.exports = {
    api,
    home
}