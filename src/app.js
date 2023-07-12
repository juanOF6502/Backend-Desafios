const express = require('express')
const { api } = require('./routes')
const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/api', api)

const port = 8080
app.listen(port, ()=> {
    console.log(`Server listening at http://localhost:${port}`)
})