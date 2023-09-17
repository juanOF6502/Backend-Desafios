const currentUser = (req, res) => {
    const user = req.user
    res.status(200).json({currentUser : user})
}

module.exports = {
    currentUser
}