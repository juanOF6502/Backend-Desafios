// const fs = require('fs/promises')
// const path = require('path')

// class ProductManager {
//     #products = []

//     constructor(){
//         this.filepath = path.join(__dirname,'../data' , 'productos.json')
//     }

//     #readFile = async() => {
//         const data = await fs.readFile(this.filepath, 'utf-8')
//         this.#products = JSON.parse(data)
//     }

//     #writeFile = async() => {
//         const data = JSON.stringify(this.#products, null, 2)
//         await fs.writeFile(this.filepath, data)
//     }

//     async getProducts(){
//         await this.#readFile()
//         return this.#products
//     }

//     async getProductById(id){
//         await this.#readFile()
//         return this.#products.find(p => p.id == id)
//     }

//     async createProduct(product){
//         await this.#readFile()
    
//         const id = (this.#products[this.#products.length - 1]?.id || 0) + 1
    
//         const { title, description, price, thumbnail, code, category, stock } = product
    
//         if (!title || !description || !price || !code || !category || !stock) {
//             throw new Error('Todos los campos, excepto thumbnail, son obligatorios!')
//         }

//         const newProduct = {
//             id,
//             title,
//             description,
//             price,
//             thumbnail,
//             status: true,
//             code,
//             category,
//             stock
//         }
        
//         this.#products.push(newProduct)
    
//         await this.#writeFile()
    
//         return newProduct
//     }

//     async saveProduct(id, product){
//         await this.#readFile()

//         const existingProduct = await this.getProductById(id)

//         if(!existingProduct){
//             return
//         }

//         const {title, description, price, thumbnail, status, code, category, stock} = product

//         existingProduct.title = title || existingProduct.title
//         existingProduct.description = description || existingProduct.description
//         existingProduct.price = price || existingProduct.price
//         existingProduct.thumbnail = thumbnail || existingProduct.thumbnail
//         existingProduct.status = status || existingProduct.status
//         existingProduct.code = code || existingProduct.code
//         existingProduct.category = category || existingProduct.category
//         existingProduct.stock = stock || existingProduct.stock

//         await this.#writeFile()
//     }

//     async deleteProduct(id){
//         await this.#readFile()

//         this.#products = this.#products.filter(p => p.id != id)

//         await this.#writeFile()
//     }
// }

// module.exports = ProductManager