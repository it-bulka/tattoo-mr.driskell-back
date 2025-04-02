const limitValidator = (limit) => {
  if (isNaN(limit) || limit <= 0) {
    return "Invalid 'limit' parameter. It must be a positive number."
  }
  return null
}

module.exports = limitValidator