const {Router} = require('express')
const ProductRouter = require('./api/products.router')
const CarritoRouter = require('./api/carts.router');

const router = Router()

router.use('/api/products', ProductRouter)
router.use('/api/carts', CarritoRouter)


module.exports = {
    api: router
}