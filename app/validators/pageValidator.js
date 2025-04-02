const pageValidator = (page) => {
  if (isNaN(page) || page <= 0) {
    return "Invalid 'page' parameter. It must be a positive number."
  }
  return null
}

module.exports = pageValidator