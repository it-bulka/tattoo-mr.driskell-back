const { categories } = require("../models/tattoo-machine");

const categoriesValidator = (categoriesList) => {
  const categoriesFilter =  Array.isArray(categoriesList) ? categoriesList : categoriesList.split(',')
  const isValid = categoriesFilter.every((category) => categories.includes(category))
  if (!isValid) {
    return `Invalid 'category' parameter. It must be a string or an array of the following strings: ${categories.join(', ')}`
  }

  return null
}

module.exports = categoriesValidator