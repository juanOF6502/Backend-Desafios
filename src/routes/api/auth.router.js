const { Router } = require('express')
const { authLogin } = require('../../controllers/auth.controller')

const router = Router()

router.post('/login', authLogin)

module.exports = router