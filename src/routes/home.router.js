const { Router } = require('express')

const {
    homeRender,
    productCategoriesRender,
    realTimeProductsRender,
    mockingproductsRender,
    cartRender,
    purchaseRender,
    chatRender,
    profileRender
} = require('../controllers/home.controller')
const isAuth = require('../middlewares/auth.middleware')
const { checkUserRole } = require('../middlewares/authorize.middleware')

const router = Router()

router.get('/',isAuth, homeRender)

router.get('/categoria/:category', isAuth, productCategoriesRender)

router.get('/cart', isAuth , cartRender)

router.get('/cart/purchase', isAuth, purchaseRender)

router.get('/chat', checkUserRole(['Usuario']), chatRender)

router.get('/profile', isAuth , profileRender)

router.get('/mockingproducts', isAuth, mockingproductsRender)

router.get('/realtimeproducts', realTimeProductsRender)

module.exports = router