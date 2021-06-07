const dotenv = require('dotenv')


dotenv.config();
module.exports = {
    MONGODB_URL: process.env.MONGODB_URL || 'mongodb://localhost/suriwebwinkel_dev',
    JWT_SECRET: process.env.JWT_SECRET || 'alternativeSecret'
}

