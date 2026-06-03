const { Discount } = require('../models/discount')
const { StatusCodes } = require('http-status-codes')
const { NotFound } = require('../errors')
const { getActiveDiscounts } = require('../sevices/discount')

const getAllDiscounts = async (req, res) => {
  const discounts = await Discount.find().sort({ createdAt: -1 })
  res.status(StatusCodes.OK).json({ data: discounts, success: true })
}

const getActiveDiscountsHandler = async (req, res) => {
  const discounts = await getActiveDiscounts()
  res.status(StatusCodes.OK).json({ data: discounts, success: true })
}

const createDiscount = async (req, res) => {
  const discount = new Discount(req.body)
  await discount.save()
  res.status(StatusCodes.CREATED).json({ data: discount, success: true })
}

const updateDiscount = async (req, res) => {
  const { id } = req.params
  const discount = await Discount.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
  if (!discount) throw new NotFound('Discount not found')
  res.status(StatusCodes.OK).json({ data: discount, success: true })
}

const deactivateDiscount = async (req, res) => {
  const { id } = req.params
  const discount = await Discount.findByIdAndUpdate(id, { isActive: false }, { new: true })
  if (!discount) throw new NotFound('Discount not found')
  res.status(StatusCodes.OK).json({ data: discount, success: true })
}

module.exports = { getAllDiscounts, getActiveDiscountsHandler, createDiscount, updateDiscount, deactivateDiscount }
