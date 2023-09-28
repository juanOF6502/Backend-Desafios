const fs = require('fs/promises')
const path = require('path')
const productManager = require('./product.file.manager')


class CarritoManager {
    #carritos = []

    constructor(){
        this.filepath = path.join(__dirname, '../data', 'carts.json')
    }

    #readFile = async() => {
        const data = await fs.readFile(this.filepath, 'utf-8')
        this.#carritos = JSON.parse(data)
    }

    #writeFile = async() => {
        const data = JSON.stringify(this.#carritos, null, 2)
        await fs.writeFile(this.filepath, data)
    }

    async getAll(){
        await this.#readFile()
        return this.#carritos
    }

    async getById(id){
        await this.#readFile()
        return this.#carritos.find(p => p.id == id)
    }

    async create(){
        await this.#readFile()

        const id = (this.#carritos[this.#carritos.length - 1]?.id || 0) + 1

        const newCart = {
            id,
            products: []
        }
        
        this.#carritos.push(newCart)

        await this.#writeFile()

        return newCart
    }

    async addProductCart(id, productId) {
        await this.#readFile()

        const selectedCart = await this.getById(id)

        const addNewProduct = await productManager.getById(productId)

        if(!addNewProduct){
            return
        }

        const addedProduct = {
            product: addNewProduct,
            qty: 1
        }

        const existingProductIndex = selectedCart.products.findIndex(p => p.product._id === productId)

        if (existingProductIndex !== -1) {
            selectedCart.products[existingProductIndex].qty += 1
        } else {
            selectedCart.products.push(addedProduct)
        }

        await this.#writeFile()

        return selectedCart
    }

    async deleteCartProduct(cartId, productId) {
        await this.#readFile()

        const selectedCart = await this.getById(cartId)

        if (!selectedCart) {
            throw new Error('Cart not found')
        }

        
        selectedCart.products = selectedCart.products.filter(p => p.product._id !== productId)

        await this.#writeFile()
    }

    async deleteAllCartProducts(cartId) {
        await this.#readFile()

        const selectedCart = await this.getById(cartId)

        if (!selectedCart) {
            throw new Error('Cart not found')
        }

        
        selectedCart.products = []

        await this.#writeFile()
    }

    async updatedCartProducts(cartId, newProducts){
        await this.#readFile()

        const selectedCart = await this.getById(cartId)

        if (!selectedCart) {
            throw new Error('Cart not found')
        }

        
        selectedCart.products = newProducts

        await this.#writeFile()
    }

    async updateProductQuantity(cartId, productId, newQty) {
        await this.#readFile()

        const selectedCart = await this.getById(cartId)

        if (!selectedCart) {
            throw new Error('Cart not found')
        }

        
        const productToUpdate = selectedCart.products.find(p => p.product._id === productId)

        if (productToUpdate) {
            productToUpdate.qty = newQty
        }

        await this.#writeFile()
    }
}


module.exports = new CarritoManager()