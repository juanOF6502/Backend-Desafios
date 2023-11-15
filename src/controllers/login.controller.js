const config = require('../config/config')
const jwt = require('jsonwebtoken')

const mailSenderService = require('../services/mail.sender')
const { hashPassword } = require('../utils/password.utils')
const { CustomError, ErrorType } = require('../errors/custom.error')
const ManagerFactory = require('../repositories/factory')
const { developmentLogger, productionLogger } = require('../logger')

const logger = process.env.NODE_ENV === 'production' ? productionLogger : developmentLogger
const userRepository = ManagerFactory.getManagerInstace('users')


const logout = async (req, res) => {
    const { firstname, email } = req.user

    try {
        const user = await userRepository.getByEmail(email)

        if (user) {
            user.last_connection = new Date().toLocaleString()
            await user.save()
        }
    } catch (error) {
        logger.error(error)
    }

    req.logOut((error) => {
        if (!error) {
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

const recoverpassword = (req, res) => {
    const { email } = req.body

    const token = jwt.sign({ email }, config.JWT_SECRET, { expiresIn: '1h' })
    
    const resetLink = `http://localhost:8080/resetpassword?token=${token}`

    const template = `
        <html>
            <body>
                <div style="font-family: Arial, sans-serif; background-color: #f2f2f2; text-align: center;">
                    <div style="background-color: #fff; border-radius: 10px; box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); padding: 20px; max-width: 400px; margin: 0 auto;">
                        <h1 style="color: #333;">Recuperación de contraseña</h1>
                        <p style="font-size: 16px; line-height: 1.5;">Ingresa al siguiente enlace para restablecer tu contraseña:</p>
                        <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px;">RESTABLECER CONTRASEÑA</a>
                        <p style="font-size: 16px; line-height: 1.5;"><strong>El enlace expirará en 1 hora.</strong></p>
                    </div>
                </div>
            </body>
        </html>
    `

    mailSenderService.send(email, template)

    res.redirect('/login')
}

module.exports = {
    logout,
    resetpassword,
    githubCallBack,
    recoverpassword
}