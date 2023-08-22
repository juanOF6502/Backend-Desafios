const userModel = require('../models/user.model')

class UserManager {
    async getAll(){
        return await userModel.find({}).lean()
    }

    getById(id){
        return  userModel.findById(id).lean()
    }

    getByEmail(email){
        return userModel.findOne({email}).lean()
    }

    async create(user){
        return await userModel.create(user)
    }

    async saveUser(id, user){
        const result = await userModel.updateOne({ _id: id }, user)
        return result
    }

    async deleteUIser(id) {
        const result = await userModel.deleteOne({ _id: id })
        return result
    }
}


module.exports = new UserManager()