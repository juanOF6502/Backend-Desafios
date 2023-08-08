const { Router } = require('express')

const productManagerMDB = require('../../managers/product.manager')
const router = Router()



router.get('/', async (req, res) => {
    const {search, limit} = req.query

    const products = await productManagerMDB.getProducts()
    let productstFilter = products
    console.log('Buscando productos...')

    if(search){
        console.log(`Buscando productos con "${search}"`)
        productstFilter = products.filter(p => p.title.toLowerCase().includes(search) || p.description.toLowerCase().includes(search))
    }
    if(limit){
        console.log(`Busqueda limitada a ${limit} productos`)
        const limitValue = parseInt(limit)
        productstFilter = productstFilter.slice(0, limitValue)
    } 

    res.send(productstFilter)
})

router.get('/:pid', async (req, res) => {
    const products = await productManagerMDB.getProducts()

    const pid = req.params.pid

    console.log(`Buscando producto con ID ${pid}`)

    for (const p of products){
        if(p._id == pid) {
            res.send(p)
            return
        }
    }

    res.sendStatus(404)
})

router.post('/', async (req, res) => {
    const { body, io } = req
    try {
        const product = await productManagerMDB.createProduct(body)
        io.emit('newProduct', product)
        res.status(201).send(product)
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
})

router.put('/:pid', async (req, res) => {
    const { pid } = req.params
    const { body } = req
    
    if(!await productManagerMDB.getProductById(pid)){
        res.sendStatus(404)
        return
    }

    await productManagerMDB.saveProduct(pid, body)
    res.sendStatus(200)
})

router.delete('/:pid', async (req, res) => {
    const { pid } = req.params
    const { io } = req

    if(!await productManagerMDB.getProductById(pid)){
        res.sendStatus(404)
        return
    }

    await productManagerMDB.deleteProduct(pid)
    io.emit('deleteProduct', pid)
    res.sendStatus(200)
})

module.exports = router