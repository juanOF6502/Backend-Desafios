const { Schema, model } = require('mongoose') 

const schema = new Schema({
    title: String,
    description: String,
    price: Number,
    thumbnail: String,
    code: String,
    stock: Number,
    status: Boolean,
    category: [String]
})

const productModel = model('products', schema)

module.exports = productModel