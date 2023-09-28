require('dotenv').config()

module.exports = {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_STRATEGY_NAME: process.env.GITHUB_STRATEGY_NAME,
    PERSISTANCE: process.env.PERSISTANCE
}