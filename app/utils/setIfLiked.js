/**
 * Converts an array of Mongo ObjectIDs to a Set of string IDs.
 *
 * @param {Array<string | number | import('mongoose').Types.ObjectId>} likes - An array of IDs (strings, numbers, or ObjectIds).
 * @returns {Set<string>} A set of unique string IDs.
 */

const setUniqueIds = (likes) => {
  return new Set(likes.map(id => id.toString()))
}


/**
 * Adds an `isLiked` flag to each product based on the provided liked IDs.
 *
 * @param {Array<string | number | import('mongoose').Types.ObjectId>} likesIds - An array of liked IDs (strings, numbers, or ObjectIds).
 * @param {Array<{ id: string | number, [key: string]: any }>} products - An array of product objects.
 * @returns {Array<{ id: string | number, [key: string]: any, isLiked: boolean }>} An array of products with an added `isLiked` property.
 */
const setIfLikedMany = (likesIds, products) => {
  const uniqueLikes = setUniqueIds(likesIds)

  return products.map(product => {
    const { id, ...rest } = product

    return {
      id,
      ...rest,
      isLiked: uniqueLikes.has(id.toString()),
    }
  })
}

/**
 * Adds an `isLiked` flag to a single product based on the provided liked IDs.
 *
 * @param {Array<string | number | import('mongoose').Types.ObjectId>} likesIds - An array of liked IDs (strings, numbers, or ObjectIds).
 * @param {{ id: string | number, [key: string]: any }} product - A product object.
 * @returns {{ id: string | number, [key: string]: any, isLiked: boolean }} A product object with an added `isLiked` property.
 */
const setIfLikedSingle = (likesIds, product) => {
  const uniqueLikes = setUniqueIds(likesIds)

  const { id, ...rest } = product

  return {
    id,
    ...rest,
    isLiked: uniqueLikes.has(id.toString()),
  }
}

module.exports = {
  setIfLikedMany,
  setIfLikedSingle
}