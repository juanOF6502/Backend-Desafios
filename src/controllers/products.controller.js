const { CustomError, ErrorType } = require('../errors/custom.error')
const ManagerFactory = require('../repositories/factory')
const { developmentLogger, productionLogger } = require('../logger')
const mailSender = require('../services/mail.sender')

const logger = process.env.NODE_ENV === 'production' ? productionLogger : developmentLogger
const productRepository = ManagerFactory.getManagerInstace('products')

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
            throw new CustomError('Error obtaining products', ErrorType.DB_ERROR)
        }

        res.send({ pagination: pageInfo })
    } catch (error) {
        logger.error(error)
        res.sendStatus(500)
    }
}

const getById = async (req, res) => {
    const pid = req.params.pid
    try {
        const product = await productRepository.getById(pid)
        if (!product) {
            throw new CustomError('Product not found', ErrorType.NOT_FOUND)
        }
        res.send(product)
    } catch (error) {
        logger.error(error)
        res.sendStatus(404)
    }
}

const createProduct = async (req, res) => {
    const { body, io, user } = req
    try {
        const product = await productRepository.create(body)
        io.emit('newProduct', product)
        res.status(201).send(product)
    } catch (error) {
        logger.error(error)
        res.sendStatus(400)
    }
}

const updateProduct = async (req, res) => {
    const { pid } = req.params
    const { body } = req
    
    try {
        const existingProduct = await productRepository.getById(pid)
        if (!existingProduct) {
            throw new CustomError('Product not found', ErrorType.NOT_FOUND)
        }

        await productRepository.update(pid, body)
        res.sendStatus(200)
    } catch (error) {
        logger.error(error)
        res.sendStatus(500)
    }
}

const deleteProduct = async (req, res) => {
    const { pid } = req.params
    const { io } = req

    try {
        const existingProduct = await productRepository.getById(pid)
        if (!existingProduct) {
            throw new CustomError('Product not found', ErrorType.NOT_FOUND)
        }

        const ownerUser = await userRepository.getById(existingProduct.owner)
        
        if (ownerUser.isPremium) {
            const mailBody = `<p>Hola ${ownerUser.email}, tu producto ${existingProduct.title} ha sido eliminado.</p>`
            await mailSender.send(ownerUser.email, mailBody)
        }

        await productRepository.delete(pid)
        io.emit('deleteProduct', pid)
        res.sendStatus(200)
    
    } catch (error) {
        logger.error(error)
        res.sendStatus(500)
    }
}

module.exports = {
    getAll,
    getById,
    createProduct,
    updateProduct,
    deleteProduct
}