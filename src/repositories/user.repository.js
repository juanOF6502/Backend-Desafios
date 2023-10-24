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

    async changeUserRole(id) {
        try {
            const user = await userModel.findById(id)

            if (!user) {
                throw new Error('User not found!')
            }

            user.role = user.role === 'Usuario' ? 'Premium' : 'Usuario'

            await user.save()

            return user
        } catch (error) {
            throw error
        }
    }
}

module.exports = new UserRepository()