const { Router } = require('express')
const cartManagerMDB = require('../../managers/cart.manager')
const cartModel = require('../../models/cart.model')


const router = Router()

router.get('/', async (req, res) => {
    const carts = await cartManagerMDB.getAllCarts()
    res.send(carts)
})

router.get('/:cid', async (req, res) => {
    const { cid } = req.params
    try {
        const cart = await cartModel.findById(cid).populate({ path: 'products.product', select: ['title', 'price', 'description', 'code', 'stock'] })
        if (cart) {
            res.send(cart)
        } else {
            res.sendStatus(404)
        }
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
})

router.post('/', async (req, res) => {
    const { body } = req
    const cart = await cartManagerMDB.createCart(body)
    res.send(cart)
})

router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    console.log('cid:', cid)
    console.log('pid:', pid)

    try {
        const updatedCart = await cartManagerMDB.addProductToCart(cid, pid)
        res.send(updatedCart)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
})

router.put('/:cid', async (req, res) => {
    const { cid } = req.params
    const { body } = req

    try {
        await cartManagerMDB.updatedCartProducts(cid, body)
        res.sendStatus(200)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
})

router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params
    const { qty } = req.body

    try {
        await cartManagerMDB.updateProductQuantity(cid, pid, qty)
        res.sendStatus(200)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
})

router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params

    try {
        await cartManagerMDB.deleteCartProduct(cid, pid)
        res.sendStatus(200)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
})

router.delete('/:cid', async (req, res) => {
    const { cid } = req.params

    try {
        await cartManagerMDB.deleteAllCartProducts(cid)
        res.sendStatus(200)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
})

module.exports = router