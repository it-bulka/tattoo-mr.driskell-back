const mongoose = require("mongoose")
const { langValidator } = require("../utils")

const serviceType = ["fixed", "percentage"]

const ServiceSchema = new mongoose.Schema({
  name: { type: Map, of: String, required: true, validate: langValidator },
  description: { type: Map, of: String, required: true, validate: langValidator },
  type: { type: String, enum: serviceType, required: true },
  currency: { type: String, default: "UAN" },
  value: { type: Number, required: true }, // if "fixed" — price in currency, if "percentage" — in %
  status: { type: String, enum: ['active', 'inactive', 'deleted'], default: 'active' }
})

const Service = mongoose.model("Service", ServiceSchema)
module.exports = {
  Service,
  serviceType
}
