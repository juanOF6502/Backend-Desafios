const { Router } = require('express')
const ProductManager = require('../managers/ProductManager')

const productManager = new ProductManager()
const router = Router()

router.get('/', async(req, res) => {
    const products = await productManager.getProducts()

    res.render('home', {
        title: 'Home',
        products,
        style: 'home'
    })
})

router.get('/realtimeproducts', async(req, res) => {
    const products = await productManager.getProducts()

    res.render('realTimeProducts', {
        title: 'Home',
        products,
        style: 'home'
    })
})


module.exports = router