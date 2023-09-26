const currentUser = (req, res) => {
    const user = req.user

    const userResponse = {
        _id: user._id,
        userName: `${user.firstname.trim()} ${user.lastname.trim()}`,
        role: user.role,
    }

    req.currentUser = userResponse

    res.status(200).json({currentUser : userResponse })
}

module.exports = {
    currentUser
}