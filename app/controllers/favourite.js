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

  const rejected = result.filter(r => r.status === 'rejected')

  if (rejected.length) {
    const errors = rejected.map(r => r.reason?.message || r.reason).join('; ')
    return res.status(rejected.length === result.length ? 500 : 207).json({
      data: { added: idsToAdd || [], removed: idsToRemove || [] },
      success: false,
      error: { message: errors },
    })
  }

  return res.json({
    data: { added: idsToAdd || [], removed: idsToRemove || [] },
    success: true,
  })
}

module.exports = {
  getAllFavouriteByUser,
  setFavourite,
  deleteFavourite,
  getAllFavouriteIdsByUser,
  batchFavourite
}