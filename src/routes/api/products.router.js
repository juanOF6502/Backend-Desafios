const { Router } = require('express')
const { 
    getAll, 
    getById, 
    createProduct, 
    updateProduct, 
    deleteProduct
} = require('../../controllers/products.controller')

const router = Router()

router.get('/', getAll)

router.get('/:pid', getById)

router.post('/', createProduct)

router.put('/:pid', updateProduct)

router.delete('/:pid', deleteProduct)

module.exports = router