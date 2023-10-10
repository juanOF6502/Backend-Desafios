const { 
    createLogger, 
    format: { combine, colorize, simple, timestamp, printf }, 
    transports: { Console, File } 
} = require('winston')

const logLevels = {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
}

const logColors = {
    debug: 'blue',
    http: 'green',
    info: 'cyan',
    warning: 'yellow',
    error: 'red',
    fatal: 'magenta',
}

const errorLogFormat = printf(({ level, message, timestamp }) => {
    return `[${level}]: ${message} - ${timestamp}`
})

const developmentLogger = createLogger({
    levels: logLevels,
    transports: [
        new Console({
            level: 'debug',
            format: combine(
                colorize({ colors: logColors }),
                simple()
            ),
        }),
    ],
})

const productionLogger = createLogger({
    levels: logLevels,
    transports: [
        new Console({
            level: 'info',
            format: combine(
                colorize({ colors: logColors }),
                simple()
            ),
        }),
        new File({
            filename: './logs/error.log',
            level: 'error',
            format: combine(
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                errorLogFormat
            )
        })
    ],
})

module.exports = {
    developmentLogger,
    productionLogger,
}


