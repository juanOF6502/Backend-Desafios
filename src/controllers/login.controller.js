require('dotenv').config()

const ManagerFactory = require('../repositories/factory')
const userRepository = ManagerFactory.getManagerInstace('users')
const { hashPassword } = require('../utils/password.utils')

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

    const user = await userRepository.getByEmail(email)

    if(!user) {
        return res.render('resetpassword', { error: 'Usuario no existe!' })
    }

    if(password1 !== password2) {
        return res.render('resetpassword', { error: 'Las contraseñas deben coincidir!' })
    }

    try {
        await userRepository.update(user._id, {
        ...user,
        password: hashPassword(password1)
        })

        res.redirect('/login')
    } catch (e) {
        console.log(e)
        return res.render('resetpassword', { error: 'Ha ocurrido un error' })
    }
}

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

module.exports = {
    logout,
    resetpassword,
    githubCallBack
}