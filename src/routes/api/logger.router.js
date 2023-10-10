const { Router } = require('express')
const { developmentLogger, productionLogger } = require('../../logger')
const router = Router()

const logger = process.env.NODE_ENV === 'production' ? productionLogger : developmentLogger

router.get('/loggerTest', (req, res) => {
    logger.debug('Este es un logger de debug')
    logger.http('Este es un logger de HTTP')
    logger.info('Este es un logger de información')
    logger.warning('Este es un logger de advertencia')
    logger.error('Este es un logger de error')
    logger.fatal('Este es un logger fatal')

    res.send('Logs de prueba generados exitosamente')
})

module.exports = router