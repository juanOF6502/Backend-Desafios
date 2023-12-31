const Repository = require('./base.repository')
const userModel = require('../models/user.model')

class UserRepository extends Repository {
    constructor(){
        super(userModel)
    }

    async findUsers(filter){
        return await userModel.find(filter)
    }

    async deleteMany(filter){
        return await userModel.deleteMany(filter)
    }

    async getByEmail(email){
        return await userModel.findOne({email})
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

    async getByIdExec(id){
        return await userModel.findById({ _id: id })
    }
}

module.exports = new UserRepository()