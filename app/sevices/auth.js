const User = require("../models/user")
const { Unauthenticated, Conflict } = require("../errors")

const registration = async ({ email, password, name, verificationToken }) => {
  const existedUser = await User.findOne({ email }).select('email isVerified')
  if (existedUser && existedUser.isVerified) {
    throw new Conflict("Email already exists")
  }

  const verificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

  if (existedUser && !existedUser.isVerified) {
    existedUser.name = name
    existedUser.password = password
    existedUser.verificationToken = verificationToken
    existedUser.verificationExpiresAt = verificationExpiresAt

    return await existedUser.save()

  }

  const user = await User.create({
    name,
    email,
    password,
    verificationToken,
    verificationExpiresAt
  })

  return user
}

const verifyUser = async ({ email, verificationToken }) => {
  const user = await User.findOne({ email })

  if(user?.isVerified) {
    throw new Conflict('User already verified.')
  }

  if(!user || (user.verificationToken !== verificationToken && user.verificationToken !== '')) {
    throw new Unauthenticated('Verification failed')
  }

  user.isVerified = true
  user.verificationToken = ''
  user.verificationExpiresAt = undefined

  return  await user.save()
}

module.exports = {
  registration,
  verifyUser
}