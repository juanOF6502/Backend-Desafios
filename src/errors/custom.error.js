const ErrorType = {
    DB_ERROR: 'Error en la base de datos',
    GENERAL_ERROR: 'Error general en la aplicacion',
    AUTH_ERROR: 'Error de autenticación',
    NOT_FOUND: 'No encontrado',
    VALIDATION_ERROR: 'Error de validación de datos',
    UNAUTHORIZED: 'No autorizado',
    OTHER_ERROR: 'Otro codigo de error'
}

class CustomError extends Error {
    constructor(message, type){
        super(message)

        this.type = type
    }
}

module.exports = {
    CustomError,
    ErrorType
}