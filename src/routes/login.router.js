const { Router } = require('express')
const passport = require('passport')
require('dotenv').config()

const { logout, resetpassword, githubCallBack } = require('../controllers/login.controller')
const isAuth = require('../middlewares/auth.middleware')


const router = Router()

router.get('/github', passport.authenticate(process.env.GITHUB_STRATEGY_NAME), (req, res) => {})
router.get('/githubSession', passport.authenticate(process.env.GITHUB_STRATEGY_NAME), githubCallBack)
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