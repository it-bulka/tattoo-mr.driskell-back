const { langs, langValidator } = require('./langValidator')
const { fractTwoDigit } = require('./fractTwoDigit')
const { setUrl } = require('./setUrl')
const { escapeRegex } = require('./escapeRegex')
const { createTokenPayload } = require('./createTokenPayload')
const { getUserOTD } = require('./getUserOTD')

module.exports = {
  langs,
  langValidator,
  fractTwoDigit,
  setUrl,
  escapeRegex,
  createTokenPayload,
  getUserOTD
}