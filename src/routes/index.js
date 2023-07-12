const {Router} = require('express')
const ProductRouter = require('./api/products.router')
const CarritoRouter = require('./api/carts.router');

const router = Router()

router.use('/products', ProductRouter)
router.use('/carts', CarritoRouter)


module.exports = {
    api: router
}