// TODO: add role
const createTokenPayload = (user, deviceId) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  deviceId,
})

module.exports = { createTokenPayload }