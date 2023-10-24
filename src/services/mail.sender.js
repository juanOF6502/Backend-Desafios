const nodemailer = require('nodemailer')
const config = require('../config/config')

class MailSender {
    constructor(){
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: config.MAIL.GMAIL_ADDRESS,
                pass: config.MAIL.GMAIL_PWD
            }
        })
    }

    async send(to, body){
        await this.transporter.sendMail({
            from: 'no-reply@recoverpass.com',
            subject: 'Reestablecer contraseña',
            to,
            html: body
        })
    }
}


module.exports = new MailSender()