const ManagerFactory = require('../repositories/factory')

const { CustomError, ErrorType } = require('../errors/custom.error')
const userRepository = ManagerFactory.getManagerInstace('users')
const { developmentLogger, productionLogger } = require('../logger')

const logger = process.env.NODE_ENV === 'production' ? productionLogger : developmentLogger

const changeUserRole = async (req, res) => {
    const { uid } = req.params

    try {
        const user = await userRepository.getById(uid)

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        if (
            user.documents.some(doc => doc.name === 'Identificacion') &&
            user.documents.some(doc => doc.name === 'Comprobante de domicilio') &&
            user.documents.some(doc => doc.name === 'Comprobante de estado de cuenta')
        ) {
            await userRepository.changeUserRole(uid)
            return res.sendStatus(200)
        } else {
            return res.status(400).json({ message: 'Documentacion de usuario no procesada' })
        }
    } catch (error) {
        logger.error(error)
        throw new CustomError('Error al actualizar el rol de usuario', ErrorType.GENERAL_ERROR)
    }
}

const uploadFiles = async (req,res) => {
    const { uid }= req.params

    try {
        const user = await userRepository.getByIdExec(uid)
    
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        const uploadedFiles = req.files.map(file => {
            let fileLink = ''

            if (file.mimetype.startsWith('image/')) {
                if(file.filename.startsWith('profileImage')){
                    fileLink = `http://localhost:8080/static/img/profiles/${file.filename}`
                } else {
                    fileLink = `http://localhost:8080/static/img/products/${file.filename}`
                }
            } else {
                fileLink = `http://localhost:8080/static/documents/${file.filename}`
            }

            return {
                name: file.filename,
                reference: fileLink
            }
        })
    
        user.documents = user.documents.concat(uploadedFiles)
    
        await user.save()
    
        res.status(200).json({ message: 'Upload Successful', payload: user.documents })
    } catch (error) {
        console.error(error)
    }
}

module.exports = { 
    changeUserRole, 
    uploadFiles 
}