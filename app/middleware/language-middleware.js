const languageMiddleware = (req, res, next) => {
  req.lang = req.headers['accept-language'] || 'en'
  next()
}

module.exports = languageMiddleware
