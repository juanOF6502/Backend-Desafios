const Repository = require('./base.repository')
const cartModel = require('../models/cart.model')
const productRepository = require('../repositories/product.repository')

class CartRepository extends Repository {
    constructor(){
        super(cartModel)
    }

    async addProductToCart(cartId, productId) {
        try {

            const cart = await cartModel.findById(cartId).populate({ path: 'products',populate: {path: 'products.product'} })
            if (!cart) {
                throw new Error('Cart not found')
            }
    
            const product = await productRepository.getById(productId)
            if (!product) {
                throw new Error('Product not found')
            }
    
            const existingProduct = cart.products.find(p => p.product.toString() === productId.toString())
            if (existingProduct) {
                existingProduct.qty += 1
            } else {
                cart.products.push({
                    product: product._id,
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

    async deleteCartProduct(cartId, productId) {
        try {
            await cartModel.findByIdAndUpdate(
                cartId,
                {
                    $pull: { products: { _id: productId } }
                }
            );
        } catch (error) {
            console.error(`An error occurred: ${error}`)
            throw error
        }
    }

    async deleteAllCartProducts(cartId) {
        try {
            await cartModel.findByIdAndUpdate(
                cartId,
                {
                    $set: { products: [] }
                }
            )
        } catch (error) {
            console.error(`An error occurred: ${error}`)
            throw error
        }
    }

    async updatedCartProducts(cartId, newProducts){
        await cartModel.findByIdAndUpdate(cartId, { products: newProducts }, { new: true }).lean()
    }

    async updateProductQuantity(cartId, productId, newQty) {
        try {
            await cartModel.findByIdAndUpdate(
                cartId,
                {
                    $set: {
                        'products.$[productToUpdate].qty': newQty
                    }
                },
                {
                    arrayFilters: [
                        { 'productToUpdate._id': productId }
                    ]
                }
            )
        } catch (error) {
            console.error(`An error occurred: ${error}`)
            throw error
        }
    }

    async getByInstance(id){
        return await this.model.findById({ _id: id })
    }
}

module.exports = new CartRepository()