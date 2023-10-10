const logger = require('../logger/index')

const fn = (req, _res, next) => {
    const selectedLogger = process.env.NODE_ENV === 'production' ? logger.productionLogger : logger.developmentLogger
    selectedLogger.http(`[${req.method}] - ${req.url} at ${(new Date()).toISOString()}`)
    next();
}

module.exports = fn