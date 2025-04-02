const mongoose = require('mongoose')
const { FavouriteMachine, TattooMachine } = require('../models')
const { setImageUrls, getTotalCount } = require("../utils/tattoo-machines")
const { getTattooMachineAggregationPipeline } = require("../utils/getTattooMachineAggregationPipeline")

const getIdsAllFavouriteTattooMachines = async (req, res) => {
  const { userId } = req.body
  const likedMachines = await FavouriteMachine.find({ userId }).select("tattooMachineId")
  const likedMachineIds = new Set(likedMachines.map(like => like.machineId.toString()))
  return likedMachineIds
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

  const machinesWithImgUrl = setImageUrls(likedMachines);
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



module.exports = {
  getIdsAllFavouriteTattooMachines,
  checkIfFavourite,
  getAllFavouriteTattooMachinesByUser,
  setFavouriteTattooMachine,
  deleteFavouriteTattooMachine
}