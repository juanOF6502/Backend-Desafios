const { Schema, model } = require('mongoose')
const paginate = require('mongoose-paginate-v2') 

const schema = new Schema({
    title: String,
    description: String,
    price: Number,
    thumbnail: String,
    code: String,
    stock: Number,
    status: Boolean,
    category: [String],
    owner: { type: Schema.Types.ObjectId, ref: 'users', default: 'Admin' }
})

schema.plugin(paginate)

const productModel = model('products', schema)

module.exports = productModel