const { Schema, model } = require('mongoose')

const schema = new Schema({
    firstname: String,
    lastname: String,
    email: {type: String, index: true, unique: true},
    password: String,
    role: {type: String, default:'Usuario'},
    gender: String,
    age: Number,
    cart: {type: Schema.Types.ObjectId, ref: 'carts'},
    documents:  [{
        name : String,
        reference : String
    }],
    last_connection: String
})

const userModel = model('users', schema)

module.exports = userModel