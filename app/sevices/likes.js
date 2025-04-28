const { setIfLikedMany, setIfLikedSingle } = require("../utils/setIfLiked");
const User = require('../models/user')

const getUserLikesIds = async (userId) => {
  const user = await User.findOne({ _id: userId}).select('likes')
  const likes = (user && user.likes && !!user.likes.length) ? user.likes : null

  return likes
}

// TODO: add user middleware, token
const setLikesToResult = async (foundProducts, userId = '67e423a7338425de0b07ed80') => {
  let resultedProducts = foundProducts

  const userLikes = await getUserLikesIds(userId)

  if(userLikes) {
    resultedProducts = setIfLikedMany(userLikes, foundProducts)
  }

  return resultedProducts
}


// TODO: add user middleware, token
const setLikeToSingleResult = async (foundProduct, userId = '67e423a7338425de0b07ed80') => {
  let resultedProduct = foundProduct

  const userLikes = await getUserLikesIds(userId)

  if(userLikes) {
    resultedProduct = setIfLikedSingle(userLikes, foundProduct)
  }

  return resultedProduct
}

module.exports = {
  getUserLikesIds,
  setLikesToResult,
  setLikeToSingleResult
}