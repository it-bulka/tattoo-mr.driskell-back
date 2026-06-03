const { Bundle } = require('../models/bundle')
const { StatusCodes } = require('http-status-codes')
const { NotFound } = require('../errors')

const getAllBundles = async (req, res) => {
  const bundles = await Bundle.find().sort({ createdAt: -1 })
  res.status(StatusCodes.OK).json({ data: bundles, success: true })
}

const createBundle = async (req, res) => {
  const bundle = new Bundle(req.body)
  await bundle.save()
  res.status(StatusCodes.CREATED).json({ data: bundle, success: true })
}

const updateBundle = async (req, res) => {
  const { id } = req.params
  const bundle = await Bundle.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
  if (!bundle) throw new NotFound('Bundle not found')
  res.status(StatusCodes.OK).json({ data: bundle, success: true })
}

const deactivateBundle = async (req, res) => {
  const { id } = req.params
  const bundle = await Bundle.findByIdAndUpdate(id, { isActive: false }, { new: true })
  if (!bundle) throw new NotFound('Bundle not found')
  res.status(StatusCodes.OK).json({ data: bundle, success: true })
}

module.exports = { getAllBundles, createBundle, updateBundle, deactivateBundle }
