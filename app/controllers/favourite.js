const {
  getAllFavouriteTattooMachinesByUser,
  setFavouriteTattooMachine,
  deleteFavouriteTattooMachine,
  getIdsAllFavouriteTattooMachines,
  setManyFavouriteTattooMachine,
  deleteManyFavouriteTattooMachine
} = require('../sevices/favourite')
const { StatusCodes } = require("http-status-codes");
const { BadRequest } = require("../errors");

const getAllFavouriteByUser = async (req, res) => {
  const { userId } = req.body
  const { page = 1, limit = 10 } = req.query

  const machines = await getAllFavouriteTattooMachinesByUser({
    userId,
    page: Number(page),
    pageSize: Number(limit),
    lang: req.lang
  })

  res.status(StatusCodes.OK).json({ data: machines, status: "success" })
}

const getAllFavouriteIdsByUser = async (req, res) => {
  const { userId } = req.body

  const machinesIds = await getIdsAllFavouriteTattooMachines(userId)

  res.status(StatusCodes.OK).json({ data: machinesIds, success: true })
}

const setFavourite = async (req, res) => {
  const { id } = req.params
  const { userId } = req.body

  if (!id || !userId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: "failed",
      message: "Missing required fields: id and userId"
    })
  }

  await setFavouriteTattooMachine(id, userId)
  res.status(StatusCodes.OK).json({ status: "success" })
}

const deleteFavourite = async (req, res) => {
  const { userId } = req.body

  if(!userId) {
    throw BadRequest('Missing user id')
  }
  console.log('deleteFavourite', userId)
  const { id } = req.params
  await deleteFavouriteTattooMachine(id, userId)
  res.status(StatusCodes.OK).json({ status: "success" })
}

const batchFavourite = async (req, res) => {
  const { userId, idsToAdd, idsToRemove } = req.body

  if(!userId) {
    throw BadRequest('Missing user id')
  }

  const result = await Promise.allSettled([
    setManyFavouriteTattooMachine(idsToAdd, userId),
    deleteManyFavouriteTattooMachine(idsToRemove, userId)
  ])

  const fulfilled = result.filter(r => r.status === 'fulfilled')
  const rejected = result.filter(r => r.status === 'rejected')

  if (fulfilled.length === result.length) {
    return res.send({ success: true, message: 'All operations fulfilled' })
  } else if (rejected.length === result.length) {
    const combinedError = rejected.map(r => r.reason).join('; ')
    return res.status(500).send({
      success: false,
      message: 'All operations failed',
      error: combinedError
    });
  } else {
    const errorPart = rejected.map(r => r.reason).join('; ')
    return res.status(207).send({
      success: false,
      message: 'Some operation failed',
      errors: errorPart
    });
  }
}

module.exports = {
  getAllFavouriteByUser,
  setFavourite,
  deleteFavourite,
  getAllFavouriteIdsByUser,
  batchFavourite
}