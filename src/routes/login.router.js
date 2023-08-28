const { Router } = require('express')
const passport = require('passport')
require('dotenv').config()

const userManagerMDB = require('../managers/user.manager')
const isAuth = require('../middlewares/auth.middleware')
const { hashPassword } = require('../utils/password.utils')

const router = Router()

const logout = async (req, res) => {
    const { firstname } = req.user
    req.logOut((error) => {
        if(!error){
            res.render('logout', {
                name: firstname
            })
        }
    })
}

const resetpassword = async (req, res) => {
    const { email, password1, password2 } = req.body

    const user = await userManagerMDB.getByEmail(email)

    if(!user) {
        return res.render('resetpassword', { error: 'Usuario no existe!' })
    }

    if(password1 !== password2) {
        return res.render('resetpassword', { error: 'Las contraseñas deben coincidir!' })
    }

    try {
        await userManagerMDB.saveUser(user._id, {
        ...user,
        password: hashPassword(password1)
        })

        res.redirect('/login')
    } catch (e) {
        console.log(e)
        return res.render('resetpassword', { error: 'Ha ocurrido un error' })
    }
}



// Controller de GITHUB

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

// Github router

router.get('/github', passport.authenticate(process.env.GITHUB_STRATEGY_NAME), (req, res) => {})
router.get('/githubSession', passport.authenticate(process.env.GITHUB_STRATEGY_NAME), githubCallBack)

// Login Router

router.get('/signup', (req, res) => res.render('signup'))
router.get('/login', (req, res) => res.render('login'))
router.get('/resetpassword', (req, res) => res.render('resetpassword'))
router.get('/logout', isAuth , logout)

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
}))

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
}))

router.post('/resetpassword', resetpassword)

module.exports = router