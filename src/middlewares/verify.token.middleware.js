const jwt = require('jsonwebtoken')
const config = require('../config/config')

const verifyToken = (req, res, next) => {
    const { token } = req.query

    jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.redirect('/recoverpassword')
        }

        next()
    })
}

module.exports = verifyToken