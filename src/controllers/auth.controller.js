const ManagerFactory = require('../repositories/factory')
const userRepository = ManagerFactory.getManagerInstace('users')
const  generateToken  = require('../utils/generate.token')
const { isValidPassword } = require('../utils/password.utils')

const authLogin = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await userRepository.getByEmail(email)

        if(!user || !isValidPassword(password, user?.password)){
            return res.send({status: 'Fail', error: 'Invalid user or password'})
        }
    
        const token = generateToken(user)
    
        return res.send({status: 'Success', mesagge: token})
    } catch (error) {
        console.log(error)
        res.status(500).send({status: 'failure', error})
    }
}

module.exports = {
    authLogin
}