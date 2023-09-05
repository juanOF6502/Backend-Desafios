const { Router } = require('express')
const isAuth = require('../../middlewares/auth.middleware')

const router = Router()

router.get('/current',isAuth, (req, res) => {
    const user = req.user
    res.status(200).json({currentUser : user})
})

module.exports = router