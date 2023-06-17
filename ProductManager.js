class ProductManager {
    constructor(){
        this.products = []
        this.newId = 1
    }

    addProduct({title, description, price, thumbnail, code, stock}){

        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error('Complete todos los campos, porfavor!')
            return
        }
        
        const codeExists = this.products.find(prod => prod.code === code)
        if (codeExists){
            console.error(`El codigo "${codeExists.code}" ya existe!`)
            return
        }

        const id = this.newId
        this.newId++

        this.products.push({
            id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        })
    }

    getProducts(){
        return this.products
    }

    getProductById(id){
        const product = this.products.find(prod => prod.id === id)
        if (!product) {
            console.error('Not found')
            return 
        }
        return product
    }
}
