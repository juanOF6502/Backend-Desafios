const productModel = require('../models/product.model')

class ProductManager {
    getProducts() {
        return productModel.find().lean()
    }

    async getProductById(id) {
        return productModel.findById(id)
    }

    async createProduct(body) {
        return productModel.create(body)
    }

    async saveProduct(id, product) {
        const result = await productModel.updateOne({ _id: id }, product)
        return result
    }

    async deleteProduct(id) {
        const result = await productModel.deleteOne({ _id: id })
        return result
    }
}

module.exports = new ProductManager()