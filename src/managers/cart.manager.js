const cartModel = require('../models/cart.model')
const productModel = require('../models/product.model')

class CarritoManager {
    
    async getAllCarts(){
        return await cartModel.find().lean()
    }

    async getCartById(id){
        return await cartModel.findById(id).lean()
    }

    async createCart(body){
        return await cartModel.create(body)
    }

    async addProductToCart(cartId, productId) {
        try {
            const cart = await cartModel.findById(cartId)
            if (!cart) {
                throw new Error('Cart not found')
            }
    
            const product = await productModel.findById(productId)
            if (!product) {
                throw new Error('Product not found')
            }
    
            const existingProductIndex = cart.products.findIndex(p => p._id.toString() == productId)
    
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].qty += 1
            } else {
                cart.products.push({
                    _id: productId,
                    title: product.title,
                    qty: 1
                })
            }
    
            const updatedCart = await cart.save()
    
            return updatedCart
        } catch (error) {
            console.error(`An error occurred: ${error}`)
            throw error
        }
    }
}

module.exports = new CarritoManager()