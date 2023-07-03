const fs = require('fs/promises')
const path = require('path')

class ProductManager {
    constructor(){
        this.products = []
        this.newId = 1
        this.path = path.join(__dirname, 'productos.json')
    }

    async addProduct({title, description, price, thumbnail, code, stock}){
        const data = await fs.readFile(this.path, 'utf-8')
        const products = JSON.parse(data)

        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error('Complete todos los campos, porfavor!')
            return
        }
        
        const codeExists = products.find(prod => prod.code === code)
        if (codeExists){
            console.error(`El codigo "${codeExists.code}" ya existe!`)
            return
        }

        const id = this.newId
        this.newId++

        products.push({
            id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        })

        await fs.writeFile(this.path, JSON.stringify(products, null, 2))
    }

    async getProducts(){
        const data = await fs.readFile(this.path, 'utf-8')
        this.products = JSON.parse(data)
        return this.products
    }

    async getProductById(id){
        const data = await fs.readFile(this.path, 'utf-8')
        this.products = JSON.parse(data)
        const product = this.products.find(prod => prod.id === id)
        if (!product) {
            console.error('Invalid Product - Not found')
            return 
        }
        return product
    }

    async updateProduct(id, {title, description, price, thumbnail, code, stock}){
        const data = await fs.readFile(this.path, 'utf-8')
        const products = JSON.parse(data)

        const productUpdate = products.findIndex(prod => prod.id === id)
        if (productUpdate < 0) {
            console.error('Invalid Product - Not found')
            return 
        }

        const oldProduct = products[productUpdate]
        
        const updatedProduct = {
            id,
            title: title ?? oldProduct.title,
            description: description ?? oldProduct.description,
            price: price ?? oldProduct.price,
            thumbnail: thumbnail ?? oldProduct.thumbnail,
            code: code ?? oldProduct.code,
            stock: stock ?? oldProduct.stock,
        }

        products[productUpdate] = updatedProduct
        
        await fs.writeFile(this.path, JSON.stringify(products, null, 2))
    }

    async deleteProduct(id){
        const data = await fs.readFile(this.path, 'utf-8')
        const products = JSON.parse(data)

        const productDelete = products.findIndex(prod => prod.id === id)
        if (productDelete < 0) {
            console.error('Invalid Product - Not found')
            return 
        }

        products.splice(productDelete, 1)
        await fs.writeFile(this.path, JSON.stringify(products, null, 2))
    }
}


module.exports = ProductManager