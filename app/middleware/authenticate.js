const { Unauthenticated } = require('../errors')
const { isTokenValid } = require('../utils/jwt')

const authenticate = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization
    if(!authorizationHeader){
      next(new Unauthenticated('Authentication invalid'))
    }

    const accessToken = authorizationHeader.split(' ')[1]
    if(!accessToken){
      next(new Unauthenticated('Authentication invalid'))
    }

    const { name, role, id } = isTokenValid(accessToken)
    req.user = { name, role, id }

    next()
  } catch (e) {
    next(new Unauthenticated('Authentication invalid'))
  }
}

module.exports = {
  authenticate
}