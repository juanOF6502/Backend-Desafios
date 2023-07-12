const { Router } = require('express')
const CarritoManager = require('../../managers/CarritoManager')

const carritoManager = new CarritoManager()
const router = Router()

router.post('/', async(req, res) => {
    const { body } = req

    const cart = await carritoManager.createCart(body)

    res.send(cart)
})

router.get('/', async(req, res) => {
    const carts = await carritoManager.getAllCarts()
    res.send(carts)
})

router.get('/:cid', async(req, res) => {
    const carts = await carritoManager.getAllCarts()
    const cid = parseInt(req.params.cid)

    console.log(`Buscando carrito con ID ${cid}`)

    for (const c of carts){
        if(c.id === cid) {
            res.send(c.products)
            return
        }
    }
    res.sendStatus(404)
})

router.post('/:cid/product/:pid', async(req, res) => {
    const { cid, pid } = req.params
    const parsedCid = parseInt(cid)
    const parsedPid = parseInt(pid)

    const cart = await carritoManager.addProductCart(parsedCid, parsedPid)

    res.send(cart)
})


module.exports = router