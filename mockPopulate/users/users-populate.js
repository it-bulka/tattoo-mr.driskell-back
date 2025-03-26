const usersData = require('./users.json')
const User = require('../../app/models/user')

const populateUsers = async () => {
  await User.deleteMany({})
  await User.create(usersData)
}

module.exports = {
  populateUsers
}

