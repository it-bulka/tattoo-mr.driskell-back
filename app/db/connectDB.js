const mongoose = require('mongoose')
const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URL, {
    dbName: process.env.MONGODB_DB_NAME
  })
}

module.exports = connectDB