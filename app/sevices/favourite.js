const { FavouriteMachine, TattooMachine } = require('../models')
const { setMultipleImageUrls, getTotalCount } = require("../utils/tattoo-machines")
const { getTattooMachineAggregationPipeline } = require("../utils/getTattooMachineAggregationPipeline")
const { setIfLikedMany, setIfLikedSingle } = require('../utils/setIfLiked')

const getIdsAllFavouriteTattooMachines = async (userId) => {
  const likedMachines = await FavouriteMachine.find({ userId }).select("tattooMachineId").lean()
  if(!likedMachines?.length) return null

  return likedMachines
}

const checkIfFavourite = (likedMachineIds, machine) => {
  return likedMachineIds.has(machine._id.toString())
}

const getAllFavouriteTattooMachinesByUser = async ({ userId, page, pageSize, lang }) => {
  const likedMachineIds = await FavouriteMachine.find({ userId }).distinct("machineId")
  const likedMachines = await TattooMachine.aggregate([
    { $match: { _id: { $in: likedMachineIds } }},
    ...getTattooMachineAggregationPipeline(lang),
    { $skip: (page - 1) * pageSize },
    { $limit: pageSize }
  ])

  const machinesWithImgUrl = setMultipleImageUrls(likedMachines);
  const totalCount = await TattooMachine.countDocuments({ _id: { $in: likedMachineIds } })

  return {
    machines: machinesWithImgUrl,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    currentPage: page
  }
}

const setFavouriteTattooMachine = async (machineId, userId) => {
  await FavouriteMachine.create({
    tattooMachineId: machineId,
    userId
  })
}

const deleteFavouriteTattooMachine = async (favouriteId) => {
  FavouriteMachine.deleteOne({ _id: favouriteId })
}

const setIfLikedToResult = async (foundProducts, userId = '67e423a7338425de0b07ed80') => {
  const userLikesIds = await getIdsAllFavouriteTattooMachines(userId)

  if(!userLikesIds) return foundProducts

  return setIfLikedMany(userLikesIds, foundProducts)
}


const setIfLikedToResultForSingle = async (foundProduct, userId = '67e423a7338425de0b07ed80') => {
  const userLikesIds = await getIdsAllFavouriteTattooMachines(userId)
  if(!userLikesIds) return foundProduct

  return setIfLikedSingle(userLikesIds, foundProduct)
}



module.exports = {
  getIdsAllFavouriteTattooMachines,
  checkIfFavourite,
  getAllFavouriteTattooMachinesByUser,
  setFavouriteTattooMachine,
  deleteFavouriteTattooMachine,
  setIfLikedToResult,
  setIfLikedToResultForSingle
}