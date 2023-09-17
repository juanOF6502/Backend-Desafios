const { Router } = require('express')
const {
    homeRender,
    productCategoriesRender,
    realTimeProductsRender,
    cartRender,
    chatRender,
    profileRender
} = require('../controllers/home.controller')
const isAuth = require('../middlewares/auth.middleware')

const router = Router()

router.get('/',isAuth, homeRender)

router.get('/categoria/:category', isAuth, productCategoriesRender)

router.get('/realtimeproducts', realTimeProductsRender)

router.get('/cart', isAuth , cartRender)

router.get('/chat', chatRender)

router.get('/profile', isAuth , profileRender)

module.exports = router