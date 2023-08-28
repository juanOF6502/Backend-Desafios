const githubStrategy = require('passport-github2')
const userManagerMDB = require('../managers/user.manager')
require('dotenv').config()

const githubAccessConfig = {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `http://localhost:${process.env.PORT}/githubSession`,
    proxy: true,
    scope: ['user:email']
}

const githubUsers = async (profile, done) => {
    const { login } = profile._json
    const email = profile.emails[0].value
    const _user = await userManagerMDB.getByEmail(email)

    if (!_user) {
        const newUser = {
            firstname: login, 
            lastname: '',  
            email: profile.emails[0].value,
            password: '',
            gender: ''
        }

        const result = await userManagerMDB.create(newUser)
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