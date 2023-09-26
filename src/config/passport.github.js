const githubStrategy = require('passport-github2')

const userRepository = require('../repositories/user.repository')
const cartRepository = require('../repositories/cart.repository')
const config = require('../config/config')

const githubAccessConfig = {
    clientID: config.GITHUB_CLIENT_ID,
    clientSecret: config.GITHUB_CLIENT_SECRET,
    callbackURL: `http://localhost:${config.PORT}/githubSession`,
    proxy: true,
    scope: ['user:email']
}

const githubUsers = async (profile, done) => {
    const { login, email } = profile._json
    const _user = await userRepository.getByEmail(email)

    if (!_user) {
        const newUser = {
            firstname: login, 
            lastname: '',  
            email: email,
            password: '',
            gender: '',
            cart: null
        }

        const result = await userRepository.create(newUser)

        const newCart = await cartRepository.create()
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