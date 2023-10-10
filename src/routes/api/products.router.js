const { Router } = require('express')

const { 
    getAll, 
    getById, 
    createProduct, 
    updateProduct, 
    deleteProduct
} = require('../../controllers/products.controller')
const { checkUserRole } = require('../../middlewares/authorize.middleware')

const router = Router()

router.get('/', getAll)

router.get('/:pid', getById)

router.post('/', checkUserRole(['Admin']), createProduct)

router.put('/:pid', checkUserRole(['Admin']), updateProduct)

router.delete('/:pid', checkUserRole(['Admin']), deleteProduct)

module.exports = router