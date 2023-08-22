const { Router } = require('express')
const productManagerMDB = require('../managers/product.manager')
const cartModel = require('../models/cart.model')

const router = Router()

router.get('/', async(req, res) => {
    const { limit = 10, page = 1, sort, query, category, status } = req.query

    const { docs: products, ...pageInfo } = await productManagerMDB.getAllPaged(limit, page, sort, query, category, status)

    pageInfo.prevLink = pageInfo.hasPrevPage ? `http://localhost:8080/?page=${pageInfo.prevPage}&limit=${limit}` : ''
    pageInfo.nextLink = pageInfo.hasNextPage ? `http://localhost:8080/?page=${pageInfo.nextPage}&limit=${limit}` : ''

    const renderData = {
        title: 'Home',
        pageInfo,
        products,
        user: req.user ?  {
            ...req.user,
            isAdmin: req.user?.role == 'Admin',
        } : null,
        style: 'home'
    }
    if (req.originalUrl !== '/chat') {
        renderData.showChatIcon = true
    }

    res.render('home', renderData)
})

router.get('/categoria/:category', async (req, res) => {
    const { category } = req.params
    const { limit = 10, page = 1, sort, query, status } = req.query

    const { docs: products, ...pageInfo } = await productManagerMDB.getAllPaged(limit, page, sort, query, category, status)

    pageInfo.prevLink = pageInfo.hasPrevPage ? `http://localhost:8080/?page=${pageInfo.prevPage}&limit=${limit}` : ''
    pageInfo.nextLink = pageInfo.hasNextPage ? `http://localhost:8080/?page=${pageInfo.nextPage}&limit=${limit}` : ''

    const renderData = {
        title: 'Home',
        pageInfo,
        products,
        user: req.user ? {
            ...req.user,
            isAdmin: req.user?.role == 'Admin'
        }: null,
        style: 'home'
    }

    if (req.originalUrl !== '/chat') {
        renderData.showChatIcon = true
    }

    res.render('home', renderData)
})

router.get('/realtimeproducts', async(req, res) => {
    const renderData = {
        title: 'Real Time Products',
        style: 'home'
    }

    if (req.originalUrl !== '/chat') {
        renderData.showChatIcon = true
    }

    res.render('realTimeProducts', renderData)
})

router.get('/cart/:cid', async (req, res) => {
    const { cid } = req.params
    try {
        const cart = await cartModel.findById(cid).populate({ path: 'products.product', select: ['title', 'price'] }).lean()
        if (cart) {
            const total = cart.products.reduce((acc, product) => acc + (product.product.price * product.qty), 0)
            res.render('carrito', {
                title: 'Carrito',
                products: cart.products,
                total: total,
                user: req.user ? {
                    ...req.user,
                    isAdmin: req.user?.role == 'Admin'
                }: null,
                style: 'home'
            });
        } else {
            res.sendStatus(404)
        }
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
})

router.get('/cart', (req,res) => {
    res.render('emptycart', {
        title: 'Carrito vacio',
        user: req.user ? {
            ...req.user,
            isAdmin: req.user?.role == 'Admin'
        }: null,
        style: 'home'
    })
})

router.get('/chat', (req, res) => {
    res.render('chat', {
        title: 'Chat',
        style: 'home'
    })
})

router.get('/profile', (req, res) => {
    res.render('profile', {
        user: req.user ? {
            ...req.user,
            isAdmin: req.user?.role == 'Admin'
        }: null
    })
})

module.exports = router