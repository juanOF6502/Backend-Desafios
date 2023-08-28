const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/jwt.config')

const jwtVerifyAuthToken = (req, res, next) => {
    const authHeader = req.headers.authorization

    if(!authHeader){
        res.status(401).send({status: 'error', error: 'Not authenticated'})
        return
    }

    const token = authHeader.replace('Bearer ', '')

    try {
        const credentials = jwt.verify(token, JWT_SECRET)
        req.user = credentials
        next()
    } catch (error) {
        console.log(error)
        res.status(400)({status: 'error', error: 'Not valid token'})
        res.end()
    }
}


module.exports = jwtVerifyAuthToken