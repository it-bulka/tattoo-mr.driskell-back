const fractTwoDigit = (num) => {
  const fract = Number(num)
  if (Number.isNaN(fract)) {
    throw Error('Expected number type of data')
  }

  return Number(fract.toFixed(2))
}

module.exports = {
  fractTwoDigit
}