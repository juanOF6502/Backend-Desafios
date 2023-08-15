const { Schema, model } = require('mongoose');

const schema = new Schema({
    user: String,
    message: String
})

const chatModel = model('messages', schema)

module.exports = chatModel