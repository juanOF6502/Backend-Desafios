const { Schema, model } = require('mongoose') 

const schema = new Schema({
    products: { 
        type: [{
            product: { type: Schema.Types.ObjectId, ref: 'products' },
            qty: { type: Number, default: 0 }
        }],
    default: []
    }
})

const cartModel = model('carts', schema)

module.exports = cartModel