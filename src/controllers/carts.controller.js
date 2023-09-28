const ManagerFactory = require('../repositories/factory')
const { v4: uuidv4 } = require('uuid')

const cartRepository = ManagerFactory.getManagerInstace('carts')
const productRepository = ManagerFactory.getManagerInstace('products')
const ticketRepository = ManagerFactory.getManagerInstace('tickets')


const getAll = async (req, res) => {
    const carts = await cartRepository.getAll()
    res.send({Carts:carts})
}

const getById = async (req, res) => {
    const { cid } = req.params
    try {
        const cart = await cartRepository.getById(cid).populate({ path: 'products.product', select: ['title', 'price', 'description', 'code', 'stock'] })
        if (cart) {
            res.send(cart)
        } else {
            res.sendStatus(404)
        }
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}

const createCart = async (req, res) => {
    const { body } = req
    const cart = await cartRepository.create(body)
    res.send(cart)
}

const addProductToCart = async (req, res) => {
    const { cid, pid } = req.params

    try {
        const updatedCart = await cartRepository.addProductToCart(cid, pid)
        res.send(updatedCart)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}

const purchaseCart = async (req,res) => {
    const { cid } = req.params

    try {
        const cart = await cartRepository.getByInstance(cid)

        const { products: productsInCart} = cart
        const products = []
        const productsNotPurchased = []

        for (const { product: id, qty} of productsInCart) {
            const item = await productRepository.getByInstance(id)

            if (item.stock < qty) {
                productsNotPurchased.push({
                    product: id,
                    qty
                })
                continue
            }

            const toBuy = item.stock >= qty ? qty : item.stock

            products.push({
                product: id,
                title: item.title,
                qty: toBuy,
                price: item.price
            })

            item.stock = item.stock - toBuy

            await item.save()
        }

        const po = {
            purchaser: req.user.email,
            code: uuidv4(),
            amount: products.reduce((total, { price, qty }) => (price * qty ) + total,0),
            products: products.map(({ product, title, price, qty }) => ({ product, title, price, qty })),
            purchase_datetime: new Date().toLocaleString()
        }

        await ticketRepository.create(po)

        cart.products = productsNotPurchased
        
        await cart.save()
        
        res.send({purchaseOrder: po, productsNotPurchased: productsNotPurchased})
    } catch (error) {
        res.sendStatus(500)
    }
}

const upadteCart = async (req, res) => {
    const { cid } = req.params
    const { body } = req

    try {
        await cartRepository.updatedCartProducts(cid, body)
        res.sendStatus(200)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}

const updateProductQuantity = async (req, res) => {
    const { cid, pid } = req.params
    const { qty } = req.body

    try {
        await cartRepository.updateProductQuantity(cid, pid, qty)
        res.sendStatus(200)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}

const deleteProduct = async (req, res) => {
    const { cid, pid } = req.params

    try {
        await cartRepository.deleteCartProduct(cid, pid)
        res.sendStatus(200)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}

const deleteAllProducts = async (req, res) => {
    const { cid } = req.params

    try {
        await cartRepository.deleteAllCartProducts(cid)
        res.sendStatus(200)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}


module.exports = {
    getAll,
    getById,
    createCart,
    addProductToCart,
    purchaseCart,
    upadteCart,
    updateProductQuantity,
    deleteProduct,
    deleteAllProducts
}