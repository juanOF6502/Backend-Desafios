const { Router } = require('express')
const productManagerMDB = require('../managers/product.manager')
const cartManagerMDB = require('../managers/cart.manager')

const router = Router()

router.get('/', async(req, res) => {
    const products = await productManagerMDB.getProducts()

    const renderData = {
        title: 'Home',
        products,
        style: 'home'
    }
    if (req.originalUrl !== '/chat') {
        renderData.showChatIcon = true
    }

    res.render('home', renderData)
})

router.get('/categoria/:category', async (req, res) => {
    const { category } = req.params
    const products = await productManagerMDB.getProducts()
    const filteredProducts = category
        ? products.filter(p => p.category.some(c => c.toLowerCase() === category.toLowerCase()))
        : products

    const renderData = {
        title: 'Home',
        products: filteredProducts,
        style: 'home'
    }

    if (req.originalUrl !== '/chat') {
        renderData.showChatIcon = true
    }

    res.render('home', renderData)
})

router.get('/realtimeproducts', async(req, res) => {
    const products = await productManagerMDB.getProducts()

    const renderData = {
        title: 'Real Time Products',
        products,
        style: 'home'
    }

    if (req.originalUrl !== '/chat') {
        renderData.showChatIcon = true
    }

    res.render('realTimeProducts', renderData)
})

router.get('/carrito/:cid', async (req, res) => {
    const { cid } = req.params
    const cart = await cartManagerMDB.getCartById(cid)
    
    res.render('carrito', {
        title: 'Carrito',
        products: cart.products, 
        style: 'home'
    })
})

router.get('/chat', (req, res) => {
    res.render('chat', {
        title: 'Chat',
        style: 'home'
    })
})


module.exports = router