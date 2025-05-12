const getUserOTD = (user) => {
  return { id: user._id, name: user.name, email: user.email }
}

module.exports = { getUserOTD }