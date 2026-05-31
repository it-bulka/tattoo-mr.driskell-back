const toUserDto = ({ _id, name, email, isVerified, discount }) => ({
  id: _id.toString(),
  name,
  email,
  isVerified,
  discount,
})

module.exports = { toUserDto }
