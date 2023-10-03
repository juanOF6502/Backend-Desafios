const Repository = require('./base.repository')
const productModel = require('../models/product.model')
const { generateProducts } = require('../utils/mock.utils')

class ProductRepository extends Repository {
    constructor(){
        super(productModel)
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

    async getByInstance(id){
        return await this.model.findById({ _id: id })
    }

    async getAllMockProducts(limit = 10, page = 1) {
        const allProducts = generateProducts()

        const startIndex = (page - 1) * limit

        const endIndex = page * limit
        
        const paginatedProducts = allProducts.slice(startIndex, endIndex)
    
        return paginatedProducts
    }
}

module.exports = new ProductRepository()