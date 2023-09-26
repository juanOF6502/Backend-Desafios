const productRepository = require('../repositories/product.repository')

const getAll = async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query, category, status } = req.query

        const { docs: products, ...pageInfo } = await productRepository.getAllPaged(limit, page, sort, query, category, status)

        if (products) {
            pageInfo.status = 'success'
            pageInfo.payload = products
            pageInfo.prevPage = pageInfo.hasPrevPage ? pageInfo.prevPage : null
            pageInfo.nextPage = pageInfo.hasNextPage ? pageInfo.nextPage : null
            pageInfo.prevLink = pageInfo.hasPrevPage ? `http://localhost:8080/api/products?page=${pageInfo.prevPage}&limit=${limit}` : null
            pageInfo.nextLink = pageInfo.hasNextPage ? `http://localhost:8080/api/products?page=${pageInfo.nextPage}&limit=${limit}` : null
        } else {
            pageInfo.status = 'error'
            pageInfo.message = 'Error obtaining products'
        }

        res.send({ pagination: pageInfo })
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}

const getById = async (req, res) => {
    const pid = req.params.pid
    try {
        const product = await productRepository.getById(pid)
        res.send(product)
    } catch (error) {
        console.error(error)
        res.sendStatus(404)
    }
}

const createProduct = async (req, res) => {
    const { body, io } = req
    try {
        const product = await productRepository.create(body)
        io.emit('newProduct', product)
        res.status(201).send(product)
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
}

const updateProduct = async (req, res) => {
    const { pid } = req.params
    const { body } = req
    
    if(!await productRepository.getById(pid)){
        res.sendStatus(404)
        return
    }

    await productRepository.update(pid, body)
    res.sendStatus(200)
}

const deleteProduct = async (req, res) => {
    const { pid } = req.params
    const { io } = req

    if(!await productRepository.getById(pid)){
        res.sendStatus(404)
        return
    }

    await productRepository.delete(pid)
    io.emit('deleteProduct', pid)
    res.sendStatus(200)
}

module.exports = {
    getAll,
    getById,
    createProduct,
    updateProduct,
    deleteProduct
}