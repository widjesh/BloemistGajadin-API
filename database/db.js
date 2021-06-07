const mongoose = require('mongoose')
const dotenv = require('dotenv')
const config = require('../config')


dotenv.config();
const MONGODB_URL = config.MONGODB_URL;
mongoose.connect(
  MONGODB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  },
  err => {
    if (err) {
      console.log(`Connection Database failed due to ${err}`);
    }else{
      console.log('Database Connected Successfully!')
    }
  }
);

module.exports = mongoose;
