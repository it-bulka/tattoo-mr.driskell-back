const motorTypes = ['rotary', 'coil', 'pen-style', 'pneumatic']

const motorTypeValidator = (value) => {
  const arr = Array.isArray(value) ? value : value.split(',')
  const isValid = arr.every((v) => motorTypes.includes(v))
  if (!isValid) {
    return `Invalid 'motorType' parameter. Allowed values: ${motorTypes.join(', ')}`
  }
  return null
}

module.exports = motorTypeValidator
