const { Router } = require('express')
const ProductManager = require('../../managers/ProductManager')

const productManager = new ProductManager()
const router = Router()


router.get('/', async (req, res) => {
    const {search, limit} = req.query

    const products = await productManager.getProducts()
    let productstFilter = products

    if(search){
        console.log(`Buscando productos con "${search}"`)
        productstFilter = products.filter(p => p.title.toLowerCase().includes(search) || p.description.toLowerCase().includes(search))
        res.send(productstFilter)
    }else if(limit){
        console.log(`Busqueda limitada a ${limit} productos`)
        const limitValue = parseInt(limit)
        productstFilter = productstFilter.slice(0, limitValue)
        res.send(productstFilter)
    } else {
        console.log(`Buscando productos...`)
        res.send(productstFilter)
    }
})

router.get('/:pid', async (req, res) => {
    const products = await productManager.getProducts()

    const pid = parseInt(req.params.pid)

    console.log(`Buscando producto con ID ${pid}`)

    for (const p of products){
        if(p.id === pid) {
            res.send(p)
            return
        }
    }

    res.sendStatus(404)
})

router.post('/', async (req, res) => {
    const { body } = req
    try {
        const product = await productManager.createProduct(body)
        res.status(201).send(product) 
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
})

router.put('/:pid', async (req, res) => {
    const { pid } = req.params
    const { body } = req
    
    if(!await productManager.getProductById(pid)){
        res.sendStatus(404)
        return
    }

    await productManager.saveProduct(pid, body)
    res.sendStatus(200)
})

router.delete('/:pid', async (req, res) => {
    const { pid } = req.params

    if(!await productManager.getProductById(pid)){
        res.sendStatus(404)
        return
    }

    await productManager.deleteProduct(pid)
    res.sendStatus(200)
})

module.exports = router