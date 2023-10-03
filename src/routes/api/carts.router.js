const { Router } = require('express')
const { 
    getAll,
    getById,
    createCart,
    addProductToCart,
    purchaseCart,
    updateCart,
    updateProductQuantity,
    deleteProduct,
    deleteAllProducts
} = require('../../controllers/carts.controller')
const { checkUserRole } = require('../../middlewares/authorize.middleware')

const router = Router()

router.get('/', getAll)

router.get('/:cid', getById)

router.post('/', createCart)

router.post('/:cid/product/:pid',checkUserRole(['Usuario']), addProductToCart)

router.get('/:cid/purchase', purchaseCart)

router.put('/:cid', updateCart)

router.put('/:cid/products/:pid', updateProductQuantity)

router.delete('/:cid/products/:pid', deleteProduct)

router.delete('/:cid', deleteAllProducts)

module.exports = router