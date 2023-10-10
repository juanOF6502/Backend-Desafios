require('dotenv').config()

const { hashPassword } = require('../utils/password.utils')
const { CustomError, ErrorType } = require('../errors/custom.error')
const ManagerFactory = require('../repositories/factory')
const { developmentLogger, productionLogger } = require('../logger')

const logger = process.env.NODE_ENV === 'production' ? productionLogger : developmentLogger
const userRepository = ManagerFactory.getManagerInstace('users')


const logout = async (req, res) => {
    const { firstname } = req.user
    req.logOut((error) => {
        if(!error){
            res.render('logout', {
                name: firstname
            })
        }
    })
}

const resetpassword = async (req, res) => {
    const { email, password1, password2 } = req.body

    const user = await userRepository.getByEmail(email)

    if(!user) {
        throw new CustomError('Error obtaining user', ErrorType.NOT_FOUND)
    }

    if(password1 !== password2) {
        throw new CustomError('Passwords must coincide', ErrorType.AUTH_ERROR)
    }

    try {
        await userRepository.update(user._id, {
        ...user,
        password: hashPassword(password1)
        })

        res.redirect('/login')
    } catch (e) {
        logger.error(e)
        throw new CustomError('Ha ocurrido un error', ErrorType.GENERAL_ERROR)
    }
}

const githubCallBack = (req, res) => {
    const user = req.user
    req.session.user = {
        id: user.id,
        name: user.firstname,
        role: user?.role??'Usuario',
        email: user.email
    }

    res.redirect('/')
}

module.exports = {
    logout,
    resetpassword,
    githubCallBack
}