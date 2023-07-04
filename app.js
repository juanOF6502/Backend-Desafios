const ProductManager = require('./ProductManager')
const express = require('express')
const app = express()
const port = 8080
const productManager = new ProductManager()

app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.send(`
    <html>
        <head>
        <title>Servidor de Express</title>
        </head>
        <body style="text-align:center">
            <h1>
                Ir a productos: 
                <a style="color:blue" href="http://localhost:8080/products">
                    http://localhost:8080/products
                </a>
            </h1>
        </body>
    </html>
    `)
})

app.get('/products', async (req, res) => {
    const {search, limit} = req.query
    const products = await productManager.getProducts()
    let productstFilter = products

    if(search){
        console.log(`Buscando productos con "${search}"`)
        productstFilter = products.filter(p => p.title.includes(search) || p.description.includes(search))
        res.send(productstFilter)
    }else if(limit){
        console.log(`Buscando ${limit} producto/s`)
        const limitValue = parseInt(limit)
        productstFilter = productstFilter.slice(0, limitValue)
        res.send(productstFilter)
    } else {
        console.log(`Buscando productos...`)
        res.send(productstFilter)
    }
})

app.get('/products/:pid', async (req, res) => {
    const products = await productManager.getProducts()
    const pid = parseInt(req.params.pid)
    console.log(`Buscando producto con ID ${pid}`)
    for (const p of products){
        if(p.id === pid) {
            res.send(p)
            return
        }
    }
    res.send('ERROR: PRODUCT NOT FOUND')
})

app.listen(port, ()=> {
    console.log(`Server listening at http://localhost:${port}`)
})