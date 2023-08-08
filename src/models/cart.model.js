const { Schema, model } = require('mongoose') 

const schema = new Schema({
    products: [
        {
            _id: { type: Schema.Types.ObjectId, ref: 'products' },
            title: String,
            qty: { type: Number, default: 0 }
        }
    ]
});

const cartModel = model('carts', schema)

module.exports = cartModel