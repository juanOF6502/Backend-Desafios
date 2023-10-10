const config = require('../config/config')
const githubStrategy = require('passport-github2')
const { developmentLogger, productionLogger } = require('../logger')

const logger = process.env.NODE_ENV === 'production' ? productionLogger : developmentLogger
const ManagerFactory = require('../repositories/factory')
const userRepository = ManagerFactory.getManagerInstace('users')
const cartRepository = ManagerFactory.getManagerInstace('carts')



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
        logger.error(error)
        done(error)
    }
}

module.exports = {
    githubStrategy,
    profileGitController,
    githubAccessConfig
}