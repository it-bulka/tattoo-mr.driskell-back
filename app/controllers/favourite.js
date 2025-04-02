const {
  getAllFavouriteTattooMachinesByUser,
  setFavouriteTattooMachine,
  deleteFavouriteTattooMachine
} = require('../sevices/favourite')
const { StatusCodes } = require("http-status-codes");

const getAllFavouriteByUser = async (req, res) => {
  const { userId } = req.body
  const { page = 1, pageSize = 10 } = req.params

  const machines = await getAllFavouriteTattooMachinesByUser({
    userId,
    page,
    pageSize,
    lang: req.lang
  })

  res.status(StatusCodes.OK).json({ data: machines, status: "success" })
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
  const { id } = req.params
  await deleteFavouriteTattooMachine(id)
  res.status(StatusCodes.OK).json({ status: "success" })
}

module.exports = {
  getAllFavouriteByUser,
  setFavourite,
  deleteFavourite
}