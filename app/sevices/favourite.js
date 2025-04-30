const { FavouriteMachine, TattooMachine } = require('../models')
const { setMultipleImageUrls, getTotalCount } = require("../utils/tattoo-machines")
const { getTattooMachineAggregationPipeline } = require("../utils/getTattooMachineAggregationPipeline")
const { setIfLikedMany, setIfLikedSingle } = require('../utils/setIfLiked')
const mongoose = require('mongoose')

const getIdsAllFavouriteTattooMachines = async (userId) => {
  const likedMachines = await FavouriteMachine.find({ userId }).distinct("tattooMachineId")
  if(!likedMachines?.length) return null

  return likedMachines
}

const checkIfFavourite = (likedMachineIds, machine) => {
  return likedMachineIds.has(machine._id.toString())
}

const getAllFavouriteTattooMachinesByUser = async ({ userId, page, pageSize, lang }) => {
  const likedMachineIds = await FavouriteMachine.find({ userId }).distinct("tattooMachineId")

  const likedMachines = await TattooMachine.aggregate([
    { $match: { _id: { $in: likedMachineIds } }},
    ...getTattooMachineAggregationPipeline(lang),
    { $skip: (page - 1) * pageSize },
    { $limit: pageSize }
  ])

  const machinesWithImgUrl = setMultipleImageUrls(likedMachines);
  const totalCount = await TattooMachine.countDocuments({ _id: { $in: likedMachineIds } })

  return {
    items: machinesWithImgUrl,
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

const setManyFavouriteTattooMachine = async (machineIds, userId) => {
  if(!machineIds.length) return { success: true }

  const prodsIds = await TattooMachine.find({ _id: { $in: machineIds }}).distinct('_id').lean()

  if (!Array.isArray(prodsIds)) {
    console.log("prodsIds is not an array", prodsIds);
  }

  const favourites = prodsIds.map(id => ({
    tattooMachineId: id,
    userId: new mongoose.Types.ObjectId(userId)
  }))

  await FavouriteMachine.insertMany(favourites)

  if(prodsIds.length !== machineIds.length) {
    const set2 = new Set(prodsIds.map(id => id.toString()))
    const missing = machineIds.filter(n => !set2.has(n.toString()))

    throw Error(`Following products not found: ${missing.join(', ')}`)
  }
  return { success: true }
}

const deleteFavouriteTattooMachine = async (machineId, userId) => {
  FavouriteMachine.deleteOne({ tattooMachineId: machineId, userId })
}

const deleteManyFavouriteTattooMachine = async (machineIds, userId) => {
  if(!machineIds.length) return { success: true }

  FavouriteMachine.deleteMany({
    tattooMachineId: { $in: machineIds },
    userId
  })
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
  setIfLikedToResultForSingle,
  setManyFavouriteTattooMachine,
  deleteManyFavouriteTattooMachine
}