const { CustomError, ErrorType } = require("../errors/custom.error")

const checkUserRole = (roles) => {
    return (req, res, next) => {
        const userRole = req.user && req.user.role

        if (userRole && roles.includes(userRole)) {
            next()
        } else {
            throw new CustomError('Unauthorized', ErrorType.UNAUTHORIZED)
        }
    }
}

module.exports = {
    checkUserRole
}