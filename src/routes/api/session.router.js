const { Router } = require('express')

const router = Router()

router.get('/current', (req, res) => {
    const user = req.user
    res.status(200).json({currentUser : user})
})

module.exports = router