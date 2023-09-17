const { Router } = require('express')
const { currentUser } = require('../../controllers/session.controller')
const isAuth = require('../../middlewares/auth.middleware')

const router = Router()

router.get('/current',isAuth, currentUser)

module.exports = router