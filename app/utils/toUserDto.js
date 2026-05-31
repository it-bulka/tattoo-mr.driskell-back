const toUserDto = ({ _id, name, email, isVerified, discount, phone, city, street, apartment, entrance, floor, doorphone }) => ({
  id: _id.toString(),
  name,
  email,
  isVerified,
  discount,
  phone,
  city,
  street,
  apartment,
  entrance,
  floor,
  doorphone,
})

module.exports = { toUserDto }
