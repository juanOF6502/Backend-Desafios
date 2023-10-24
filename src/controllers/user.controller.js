const ManagerFactory = require('../repositories/factory')

const userRepository = ManagerFactory.getManagerInstace('users')
const { developmentLogger, productionLogger } = require('../logger')

const logger = process.env.NODE_ENV === 'production' ? productionLogger : developmentLogger

const changeUserRole = async (req,res) => {
    const { uid } = req.params
    try {
        await userRepository.changeUserRole(uid)
        res.sendStatus(200)
    } catch (error) {
        logger.error(error)
        throw new CustomError('Error al actualizar el rol de usuario', ErrorType.GENERAL_ERROR)
    }
}

module.exports = { changeUserRole }