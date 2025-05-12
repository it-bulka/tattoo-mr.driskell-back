const { sendEmailVerification } = require('./sendEmailVerification')
const { sendResetEmail } = require('./sendResetEmail')

module.exports = {
  sendEmailVerification,
  sendResetEmail
}