const local = require('passport-local')

const ManagerFactory = require('../repositories/factory')
const { developmentLogger, productionLogger } = require('../logger')
const { hashPassword, isValidPassword } = require('../utils/password.utils')

const LocalStrategy = local.Strategy
const logger = process.env.NODE_ENV === 'production' ? productionLogger : developmentLogger
const cartRepository = ManagerFactory.getManagerInstace('carts')
const userRepository = ManagerFactory.getManagerInstace('users')



const signup = async(req, email, password, done) => {
    const { email: _email, password: _password, password2: _password2, ...user} = req.body

    const isAdmin = email === 'adminCoder@coder.com' && password === 'adminCod3r123'

    const existingUser = await userRepository.getByEmail(email)
    if(existingUser){
        logger.info('Usuario ya existente!')
        return done(null, false)
    }

    if(_password !== _password2){
        return done(null,false)
    }

    try {
        const cart = await cartRepository.create()
        const newUser = await userRepository.create({
            ...user,
            email,
            password: hashPassword(password),
            role: isAdmin ? 'Admin' : 'Usuario',
            cart: cart._id
        })

        return done(null, {
            name: newUser.firstname,
            id: newUser._id,
            ...newUser._doc
        })
    } catch (error) {
        logger.error(error)
        done(error, false)
    }
}

const login = async (email, password, done) => {
    try {
        if (email == 'adminCoder@coder.com' && password == 'adminCod3r123') {
            const adminUser = { _id: '64e4c8c1d91b6db14e5d1c91'}
            return done(null, adminUser)
        }

        const existingUser = await userRepository.getByEmail(email)
        if(!existingUser){
            return done(null, false)
        }

        if(!password){
            return done(null, false)
        }

        if(!isValidPassword(password, existingUser.password)){
            return done(null, false)
        }

        existingUser.last_connection = new Date()
        await existingUser.save()

        done(null, existingUser)
    } catch (error) {
        logger.error(error)
        done(error, false)
    }
}

module.exports = {
    LocalStrategy,
    signup,
    login
}