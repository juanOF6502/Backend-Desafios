const userRepository = require('./user.repository')
const cartRepository = require('./cart.repository')
const productRepository = require('./product.repository')
const chatRepository = require('./chat.repository')
const ticketRepository = require('./ticket.repository')

const userManagerFile = require('./user.file.manager')
const cartManagerFile = require('./cart.file.manager')
const productManagerFile = require('./product.file.manager')
const chatManagerFile = require('./chat.file.manager')
const ticketManagerFile = require('./ticket.file.manager')

const { PERSISTANCE } = require('../config/config')

class FactoryManager {
    static getManagerInstace(name){
        if (PERSISTANCE == 'mongo') {
            switch (name) {
                case 'products':
                    return productRepository
                case 'carts':
                    return cartRepository
                case 'users':
                    return userRepository
                case 'chats':
                    return chatRepository
                case 'tickets':
                    return ticketRepository
            }
        } else {
            switch (name) {
                case 'products':
                    return productManagerFile
                case 'carts':
                    return cartManagerFile
                case 'users':
                    return userManagerFile
                case 'chats':
                    return chatManagerFile
                case 'tickets':
                    return ticketManagerFile
            }
        }
    }
}

module.exports = FactoryManager