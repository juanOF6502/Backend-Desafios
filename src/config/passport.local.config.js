const local = require('passport-local')

const ManagerFactory = require('../repositories/factory')
const cartRepository = ManagerFactory.getManagerInstace('carts')
const userRepository = ManagerFactory.getManagerInstace('users')
const { hashPassword, isValidPassword } = require('../utils/password.utils')
const LocalStrategy = local.Strategy

const signup = async(req, email, password, done) => {
    const { email: _email, password: _password, password2: _password2, ...user} = req.body

    const isAdmin = email === 'adminCoder@coder.com' && password === 'adminCod3r123'

    const existingUser = await userRepository.getByEmail(email)
    if(existingUser){
        console.log('Usuario ya existente!')
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
        console.error(error)
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
            console.log('Error')
            return done(null, false)
        }

        done(null, existingUser)
    } catch (error) {
        console.error(error)
        done(error, false)
    }
}

module.exports = {
    LocalStrategy,
    signup,
    login
}