const passport = require('passport')
const local = require('passport-local')

const userManagerMDB = require('../managers/user.manager')
const { hashPassword, isValidPassword } = require('../utils/password.utils')
const LocalStrategy = local.Strategy

const signup = async(req, email, password, done) => {
    const { email: _email, password: _password, password2: _password2, ...user} = req.body

    const isAdmin = email === 'adminCoder@coder.com' && password === 'adminCod3r123'

    const existingUser = await userManagerMDB.getByEmail(email)
    if(existingUser){
        console.log('Usuario ya existente!')
        return done(null, false)
    }

    if(_password !== _password2){
        return done(null,false)
    }

    try {
        const newUser = await userManagerMDB.create({
            ...user,
            email,
            password: hashPassword(password),
            role: isAdmin ? 'Admin' : 'Usuario'
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
        const existingUser = await userManagerMDB.getByEmail(email)
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


const init = () => {
    passport.use('local-signup', new LocalStrategy({ usernameField: 'email', passReqToCallback: true}, signup))
    
    passport.use('local-login', new LocalStrategy({ usernameField: 'email' }, login))
    
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    
    passport.deserializeUser(async (id, done) => {
        const user = await userManagerMDB.getById(id)
        done(null, user)
    })
}

module.exports = init