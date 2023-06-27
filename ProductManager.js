const fs = require('fs/promises')
const path = require('path')

class ProductManager {
    constructor(){
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
        const products = JSON.parse(data)
        return products
    }

    async getProductById(id){
        const data = await fs.readFile(this.path, 'utf-8')
        const products = JSON.parse(data)
        const product = products.find(prod => prod.id === id)
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

        products[productUpdate] = {
            id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        }

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



// PROCESO DE TESTING
const newP = new ProductManager()

async function testing(){
    console.log(await newP.getProducts())

    await newP.addProduct({
        title: 'producto prueba',
        description:'Este es un producto prueba',
        price:200,
        thumbnail:'Sin imagen',
        code:'abc123',
        stock:25
    })

    console.log(await newP.getProducts())

    console.log(await newP.getProductById(1))

    await newP.updateProduct(1, {
        title: 'producto prueba cambio',
        description:'Este es un producto prueba cambio',
        price:400,
        thumbnail:'Sin imagen',
        code:'dfg456',
        stock:50
    })
    
    console.log(await newP.getProducts())

    await newP.deleteProduct(1)

    console.log(await newP.getProducts())
}

testing()