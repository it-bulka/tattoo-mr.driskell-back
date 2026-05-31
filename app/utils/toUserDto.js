const toUserDto = ({ _id, name, email }) => ({
  id: _id.toString(),
  name,
  email,
})

module.exports = { toUserDto }
