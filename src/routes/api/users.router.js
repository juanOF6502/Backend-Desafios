const { Router } = require('express')
const { changeUserRole } = require('../../controllers/user.controller')

const router = Router()

router.put('/premium/:uid', changeUserRole)

module.exports = router