const { tags } = require("../models/tattoo-machine");

const tagsValidator = (tagsList) => {
  const tagsFilter =  Array.isArray(tagsList) ? tagsList : tagsList.split(',')
  const isValid = tagsFilter.every((tag) => tags.includes(tag))
  if (!isValid) {
    return `Invalid 'tags' parameter. It must be a string or an array of the following strings: ${tags.join(', ')}`
  }

  return null
}

module.exports = tagsValidator