const needleTypes = ['round-liner', 'magnum', 'shader', 'flat']

const needleTypeValidator = (value) => {
  const arr = Array.isArray(value) ? value : value.split(',')
  const isValid = arr.every((v) => needleTypes.includes(v))
  if (!isValid) {
    return `Invalid 'needleType' parameter. Allowed values: ${needleTypes.join(', ')}`
  }
  return null
}

module.exports = needleTypeValidator
