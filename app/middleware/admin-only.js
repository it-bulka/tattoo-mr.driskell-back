const { Unauthorized } = require('../errors')

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    throw new Unauthorized('Admin access required')
  }
  next()
}

module.exports = { adminOnly }
