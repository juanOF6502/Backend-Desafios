const { Router } = require('express')

const productManagerMDB = require('../managers/product.manager')
const userModel = require('../models/user.model')
const isAuth = require('../middlewares/auth.middleware')

const router = Router()

router.get('/',isAuth, async(req, res) => {
    const { limit = 10, page = 1, sort, query, category, status } = req.query

    const { docs: products, ...pageInfo } = await productManagerMDB.getAllPaged(limit, page, sort, query, category, status)

    pageInfo.prevLink = pageInfo.hasPrevPage ? `http://localhost:8080/?page=${pageInfo.prevPage}&limit=${limit}` : ''
    pageInfo.nextLink = pageInfo.hasNextPage ? `http://localhost:8080/?page=${pageInfo.nextPage}&limit=${limit}` : ''

    const totalCart = await userModel.findById(req.user._id).populate({path:'cart', populate:{path:'products.product'}}).lean()
    const totalProducts = Object.keys(totalCart.cart.products).length
    
    const renderData = {
        title: 'Home',
        pageInfo,
        products,
        totalProducts,
        userCart: req.user.cart,
        user: req.user ?  {
            ...req.user,
            isUser: req.user?.role == 'Usuario',
            isAdmin: req.user?.role == 'Admin',
        } : null,
        style: 'home'
    }
    if (req.originalUrl !== '/chat') {
        renderData.showChatIcon = true
    }

    res.render('home', renderData)
})

router.get('/categoria/:category',isAuth, async (req, res) => {
    const { category } = req.params
    const { limit = 10, page = 1, sort, query, status } = req.query

    const { docs: products, ...pageInfo } = await productManagerMDB.getAllPaged(limit, page, sort, query, category, status)

    pageInfo.prevLink = pageInfo.hasPrevPage ? `http://localhost:8080/?page=${pageInfo.prevPage}&limit=${limit}` : ''
    pageInfo.nextLink = pageInfo.hasNextPage ? `http://localhost:8080/?page=${pageInfo.nextPage}&limit=${limit}` : ''

    const totalCart = await userModel.findById(req.user._id).populate({path:'cart', populate:{path:'products.product'}}).lean()
    const totalProducts = Object.keys(totalCart.cart.products).length

    const renderData = {
        title: 'Home',
        pageInfo,
        products,
        totalProducts,
        userCart: req.user.cart,
        user: req.user ? {
            ...req.user,
            isUser: req.user?.role == 'Usuario',
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

router.get('/cart',isAuth, async (req,res) => {
    const user = await userModel.findById(req.user._id).populate({path:'cart',populate: {path: 'products.product'}}).lean()

    const cart = user.cart

    const total = cart.products.reduce((acc, item) => acc + item.product.price * item.qty, 0)

    res.render('carrito', {
        title: 'Carrito',
        products: cart.products,
        total: total,
        user: req.user ? {
            ...req.user,
            isUser: req.user?.role == 'Usuario',
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

router.get('/profile',isAuth,(req, res) => {
    res.render('profile', {
        user: req.user ? {
            ...req.user,
            isUser: req.user?.role == 'Usuario',
            isAdmin: req.user?.role == 'Admin'
        }: null
    })
})

module.exports = router