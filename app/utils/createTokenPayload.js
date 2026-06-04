const createTokenPayload = (user, deviceId) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  deviceId,
})

module.exports = { createTokenPayload }