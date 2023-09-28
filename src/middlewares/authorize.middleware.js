const checkUserRole = (roles) => {
    return (req, res, next) => {
        const userRole = req.user && req.user.role

        if (userRole && roles.includes(userRole)) {
            next()
        } else {
            res.status(401).send("Unauthorized")
        }
    }
}

module.exports = {
    checkUserRole
}