const SUPPORTED_LANGUAGES = ['uk', 'en']

const languageMiddleware = (req, res, next) => {
  const lang = req.headers['accept-language']
  req.lang = SUPPORTED_LANGUAGES.includes(lang) ? lang : 'en'
  next()
}

module.exports = languageMiddleware
