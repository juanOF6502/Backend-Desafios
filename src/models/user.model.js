const { Schema, model } = require('mongoose')

const schema = new Schema({
    firstname: String,
    lastname: String,
    email: {type: String, index: true},
    password: String,
    role: {type: String, default:'Usuario'},
    gender: String,
    age: Number
})

const userModel = model('users', schema)

module.exports = userModel