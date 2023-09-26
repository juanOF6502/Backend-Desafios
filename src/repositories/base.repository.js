class Repository {
    constructor(model) {
        this.model = model
    }

    async getAll() {
        return await this.model.find().lean()
    }

    async getById(id) {
        return await this.model.findById({ _id: id }).lean()
    }

    async create(obj) {
        return await this.model.create(obj)
    }

    async update(id, entity) {
        const result = await this.model.updateOne({ _id: id }, entity)
        return result
    }

    async delete(id) {
        const result = await this.model.deleteOne({ _id: id })
        return result
    }
}

module.exports = Repository