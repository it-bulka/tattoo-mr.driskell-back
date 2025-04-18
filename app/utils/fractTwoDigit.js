const fractTwoDigit = (num) => {
  const fract = Number(num).toFixed(2)
  if (Number.isNaN(fract)) {
    throw Error('Expected number type of data')
  }

  return fract
}

module.exports = {
  fractTwoDigit
}