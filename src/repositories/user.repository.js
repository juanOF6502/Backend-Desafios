const Repository = require('./base.repository')
const userModel = require('../models/user.model')

class UserRepository extends Repository {
    constructor(){
        super(userModel)
    }

    async getByEmail(email){
        return await userModel.findOne({email}).lean()
    }

    async populateUser(id){
        return await userModel.findById(id).populate({path:'cart',populate: {path: 'products.product'}}).lean()
    }
}

module.exports = new UserRepository()