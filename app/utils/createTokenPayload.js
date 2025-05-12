// TODO: add role
const createTokenPayload = (user, deviceId) => {
  return { name: user.name, id: user._id, email: user.email, deviceId }
}

module.exports = { createTokenPayload }