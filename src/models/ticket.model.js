const { Schema, model } = require('mongoose')

const schema = new Schema({
    purchaser: String,
    code: {type: String, unique: true},
    purchase_datetime: String,
    amount: Number,
    products: {
        type: [{
            product: { type: Schema.Types.ObjectId, ref:'products'},
            qty: { type: Number, default: 0}
        }]
    }
})

const ticketModel = model('ticket', schema)

module.exports = ticketModel