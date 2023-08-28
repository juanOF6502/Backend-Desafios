const passport = require('passport')
const userManagerMDB = require('../managers/user.manager')
require('dotenv').config()

const { LocalStrategy, signup, login } = require('./passport.local.config')
const { githubStrategy, githubAccessConfig, profileGitController } = require('./passport.github')

const init = () => {
    passport.use('local-signup', new LocalStrategy({ usernameField: 'email', passReqToCallback: true}, signup))
    
    passport.use('local-login', new LocalStrategy({ usernameField: 'email' }, login))
    
    passport.use(process.env.GITHUB_STRATEGY_NAME, new githubStrategy(githubAccessConfig, profileGitController))

    passport.serializeUser((user, done) => { done(null, user._id) })
    
    passport.deserializeUser(async (id, done) => {
        if (id === '64e4c8c1d91b6db14e5d1c91') {
            const adminUser = {
                firstname: 'admin',
                lastname: 'coder',
                email: 'adminCoder@coder.com',
                role: 'Admin',
            }
            done(null, adminUser)
        } else {
            const user = await userManagerMDB.getById(id)
            done(null, user)
        }
    })
}

module.exports = init