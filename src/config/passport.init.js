const passport = require('passport')
const userRepository = require('../repositories/user.repository')

require('dotenv').config()
const config = require('../config/config')

const { LocalStrategy, signup, login } = require('./passport.local.config')
const { githubStrategy, githubAccessConfig, profileGitController } = require('./passport.github')

const init = () => {
    passport.use('local-signup', new LocalStrategy({ usernameField: 'email', passReqToCallback: true}, signup))
    
    passport.use('local-login', new LocalStrategy({ usernameField: 'email' }, login))
    
    passport.use(config.GITHUB_STRATEGY_NAME, new githubStrategy(githubAccessConfig, profileGitController))

    passport.serializeUser((user, done) => { done(null, user._id) })
    
    passport.deserializeUser(async (id, done) => {
        if (id === '64e4c8c1d91b6db14e5d1c91') {
            const adminUser = {
                firstname: 'admin',
                lastname: 'coder',
                email: 'adminCoder@coder.com',
                role: 'Admin',
                cart: []
            }
            done(null, adminUser)
        } else {
            const user = await userRepository.getById(id)
            done(null, user)
        }
    })
}

module.exports = init