const { Router } = require('express')
const passport = require('passport')
require('dotenv').config()

const { logout, resetpassword, githubCallBack, recoverpassword } = require('../controllers/login.controller')
const isAuth = require('../middlewares/auth.middleware')
const verifyToken = require('../middlewares/verify.token.middleware')


const router = Router()

router.get('/github', passport.authenticate(process.env.GITHUB_STRATEGY_NAME), (req, res) => {})

router.get('/githubSession', passport.authenticate(process.env.GITHUB_STRATEGY_NAME), githubCallBack)

router.get('/signup', (req, res) => res.render('signup'))

router.get('/login', (req, res) => res.render('login'))

router.get('/resetpassword', verifyToken, (req, res) => res.render('resetpassword'))

router.get('/logout', isAuth , logout)

router.get('/recoverpassword', (req, res) => res.render('recoverpassword'))

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
}))

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
}))

router.post('/resetpassword', resetpassword)

router.post('/recoverpassword', recoverpassword)


module.exports = router