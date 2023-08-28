const { Router } = require('express')
const userManagerMDB = require('../../managers/user.manager')
const  generateToken  = require('../../utils/generate.token')
const { isValidPassword } = require('../../utils/password.utils')

const router = Router()

router.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await userManagerMDB.getByEmail(email)

        if(!user || !isValidPassword(password, user?.password)){
            return res.send({status: 'Fail', error: 'Invalid user or password'})
        }
    
        const token = generateToken(user)
    
        return res.send({status: 'Success', mesagge: token})
    } catch (error) {
        console.log(error)
        res.status(500).send({status: 'failure', error})
    }
})

module.exports = router