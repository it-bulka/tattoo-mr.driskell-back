const { labels } = require("../models/tattoo-machine");

const labelsValidator = (labelsList) => {
  const labelsFilter =  Array.isArray(labelsList) ? labelsList : labelsList.split(',')
  const isValid = labelsFilter.every((label) => labels.includes(label))
  if (!isValid) {
    return `Invalid 'labels' parameter. It must be a string or an array of the following strings: ${labels.join(', ')}`
  }

  return null
}

module.exports = labelsValidator