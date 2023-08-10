const { Router } = require('express');
const cartManagerMDB = require('../../managers/cart.manager');
const productManagerMDB = require('../../managers/product.manager')

const router = Router();

router.post('/', async (req, res) => {
    const { body } = req
    const cart = await cartManagerMDB.createCart(body)
    res.send(cart)
});

router.get('/', async (req, res) => {
    const carts = await cartManagerMDB.getAllCarts()
    res.send(carts)
});

router.get('/:cid', async (req, res) => {
    const cid = req.params.cid

    try {
        const cart = await cartManagerMDB.getCartById(cid)
        if (cart) {
            res.send(cart)
        } else {
            res.sendStatus(404)
        }
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const updatedCart = await cartManagerMDB.addProductToCart(cid, pid);
        res.send(updatedCart);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
})

module.exports = router