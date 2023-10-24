require('dotenv').config()

module.exports = {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_STRATEGY_NAME: process.env.GITHUB_STRATEGY_NAME,
    PERSISTANCE: process.env.PERSISTANCE,
    NODE_ENV: process.env.NODE_ENV,
    MAIL: {
        GMAIL_ADDRESS: process.env.GMAIL_ADDRESS,
        GMAIL_PWD: process.env.GMAIL_PWD
    },
    JWT_SECRET: process.env.JWT_SECRET
}