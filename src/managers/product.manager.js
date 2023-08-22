const productModel = require('../models/product.model')

class ProductManager {
    async getProducts() {
        const products = await productModel.find().lean()
        return products
    }

    async getAllPaged(limit = 10, page = 1, sort, query, category, status) {
        let conditions = {}
    
        if (query) {
            conditions = JSON.parse(query)
        } else if (category) {
            conditions.category = category
        } else if (status) {
            conditions.status = status
        }
    
        const options = {
            limit,
            page,
            sort: sort ? { price: sort === 'desc' ? -1 : 1 } : null,
            lean: true
        }
    
        const products = await productModel.paginate(conditions, options)
    
        return products
    }

    async getProductById(id) {
        return await productModel.findById(id)
    }

    async createProduct(body) {
        return await productModel.create(body)
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