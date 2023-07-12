const fs = require('fs/promises')
const path = require('path')
const ProductManager = require('./ProductManager')
const productManager = new ProductManager()

class CarritoManager {
    #carritos = []

    constructor(){
        this.filepath = path.join(__dirname, '../data', 'carrito.json')
    }

    #readFile = async() => {
        const data = await fs.readFile(this.filepath, 'utf-8')
        this.#carritos = JSON.parse(data)
    }

    #writeFile = async() => {
        const data = JSON.stringify(this.#carritos, null, 2)
        await fs.writeFile(this.filepath, data)
    }

    async getAllCarts(){
        await this.#readFile()
        return this.#carritos
    }

    async getCartById(id){
        await this.#readFile()
        return this.#carritos.find(p => p.id == id)
    }

    async createCart(){
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

    async addProductCart(id, product) {
        await this.#readFile()

        const selectedCart = await this.getCartById(id)

        const addNewProduct = await productManager.getProductById(product)

        if(!addNewProduct){
            return
        }

        const addedProduct = {
            id: addNewProduct.id,
            quantity: 1
        }

        const productExists = selectedCart.products.findIndex(p => p.id === addNewProduct.id)

        if(productExists < 0){
            selectedCart.products.push(addedProduct)
        } else {
            selectedCart.products[productExists].quantity += 1
        }

        await this.#writeFile()

        return selectedCart
    }
}

module.exports = CarritoManager