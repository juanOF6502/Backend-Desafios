const fs = require('fs/promises')
const path = require('path')

class UserManager {
    #users = []

    constructor(){
        this.filepath = path.join(__dirname, '../data', 'users.json')
    }

    #readFile = async() => {
        const data = await fs.readFile(this.filepath, 'utf-8')
        this.#users = JSON.parse(data)
    }

    #writeFile = async() => {
        const data = JSON.stringify(this.#users, null, 2)
        await fs.writeFile(this.filepath, data)
    }
    async getAll(){
        await this.#readFile()
        return this.#users
    }

    async getById(id) {
        await this.#readFile()
        return this.#users.find(user => user._id === id)
    }

    async getByEmail(email) {
        await this.#readFile()
        return this.#users.find(user => user.email === email)
    }

    async getUserByCartId(cartId) {
        await this.#readFile()
        return this.#users.find(user => user.cart?._id == cartId)
    }

    async getCartByUserId(userId) {
        await this.#readFile()

        const user = this.#users.find(user => user._id == userId)

        if (!user) {
            throw new Error('User not found')
        }

        return user.cart ?? { products: [] }
    }

    async create(user) {
        await this.#readFile()

        const newId = Date.now().toString()
        user._id = newId

        this.#users.push(user)

        await this.#writeFile()

        return user
    }

    async update(id, user) {
        await this.#readFile()

        const userIndex = this.#users.findIndex(u => u._id === id)

        if (userIndex !== -1) {
            this.#users[userIndex] = { ...this.#users[userIndex], ...user }
            await this.#writeFile()
            return this.#users[userIndex]
        } else {
            throw new Error('User not found')
        }
    }

    async delete(id) {
        await this.#readFile()

        const initialLength = this.#users.length
        this.#users = this.#users.filter(user => user._id !== id)

        if (this.#users.length < initialLength) {
            await this.#writeFile()
            return true
        } else {
            throw new Error('User not found')
        }
    }
    async populateUser(id){
        await this.#readFile()
        return this.#users.find(user => user._id === id)
    }
}



module.exports = new UserManager()