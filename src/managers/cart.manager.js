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

    async addProductCart(id, product) {
        try {
            const cart = await cartModel.findById(id)
    
            if (!cart) {
                throw new Error('Cart not found')
            }
    
            const productDetails = await productModel.findById(product._id)
    
            if (!productDetails) {
                throw new Error('Product not found')
            }
    
            const existingProduct = cart.products.find(p => p._id == product._id)
    
            if (existingProduct) {
                existingProduct.qty += 1
            } else {
                const productToAdd = {
                    _id: product._id,
                    title: productDetails.title,
                    qty: 1
                }
                cart.products.push(productToAdd)
            }

            const updatedCart = await cart.save()
    
            return updatedCart
        } catch (error) {
            console.log(`Ocurrio un error: ${error}`)
        }
    }
}

module.exports = new CarritoManager()