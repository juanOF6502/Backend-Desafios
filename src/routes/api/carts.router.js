const { Router } = require('express')
const { 
    getAll,
    getById,
    createCart,
    addProductToCart,
    upadteCart,
    updateProductQuantity,
    deleteProduct,
    deleteAllProducts
} = require('../../controllers/carts.controller')

const router = Router()

router.get('/', getAll)

router.get('/:cid', getById)

router.post('/', createCart)

router.post('/:cid/product/:pid', addProductToCart)

router.put('/:cid', upadteCart)

router.put('/:cid/products/:pid', updateProductQuantity)

router.delete('/:cid/products/:pid', deleteProduct)

router.delete('/:cid', deleteAllProducts)

module.exports = router