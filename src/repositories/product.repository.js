const Repository = require('./base.repository')
const productModel = require('../models/product.model')

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
}

module.exports = new ProductRepository()