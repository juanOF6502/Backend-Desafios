const githubStrategy = require('passport-github2')
const userManagerMDB = require('../managers/user.manager')
const cartManagerMDB = require('../managers/cart.manager')
require('dotenv').config()

const githubAccessConfig = {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `http://localhost:${process.env.PORT}/githubSession`,
    proxy: true,
    scope: ['user:email']
}

const githubUsers = async (profile, done) => {
    const { login, email } = profile._json
    console.log(profile._json)
    const _user = await userManagerMDB.getByEmail(email)

    if (!_user) {
        const newUser = {
            firstname: login, 
            lastname: '',  
            email: email,
            password: '',
            gender: '',
            cart: null
        }

        const result = await userManagerMDB.create(newUser)

        const newCart = await cartManagerMDB.createCart()
        result.cart = newCart._id
        await result.save()

        return done(null, result)
    }

    return done(null, _user)
}

const profileGitController = async(accessToken, refreshToken, profile, done) => {
    try {
        return await githubUsers(profile,  done)
    } catch (error) {
        console.error(error)
        done(error)
    }
}

module.exports = {
    githubStrategy,
    profileGitController,
    githubAccessConfig
}