const SENSITIVE_FIELDS = [
  'password', 'confirmpassword', 'token', 'verificationtoken',
  'passwordtoken', 'refreshtoken', 'accesstoken', 'authorization',
]

const sanitize = (obj) => {
  if (!obj || typeof obj !== 'object') return obj
  const sanitized = Array.isArray(obj) ? [...obj] : { ...obj }
  for (const key of Object.keys(sanitized)) {
    if (SENSITIVE_FIELDS.includes(key.toLowerCase())) {
      sanitized[key] = '[REDACTED]'
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitize(sanitized[key])
    }
  }
  return sanitized
}

const format = (level, tag, message, data) => {
  const ts = new Date().toISOString()
  const prefix = `${ts} [${level}] [${tag}]`
  if (data !== undefined) {
    return `${prefix} ${message} ${JSON.stringify(sanitize(data))}`
  }
  return `${prefix} ${message}`
}

const logger = {
  info: (tag, message, data) => console.log(format('INFO', tag, message, data)),
  warn: (tag, message, data) => console.warn(format('WARN', tag, message, data)),
  error: (tag, message, data) => console.error(format('ERROR', tag, message, data)),
  sanitize,
}

module.exports = logger
