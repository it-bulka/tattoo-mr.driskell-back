const mongoose = require('mongoose')

const favouriteMachineSchema = new mongoose.Schema({
  userId: { type:  mongoose.Types.ObjectId, ref: 'User', required: true },
  tattooMachineId: { type: mongoose.Types.ObjectId, ref: 'TattooMachine', required: true },
})

const FavouriteMachine = mongoose.model('FavouriteMachine', favouriteMachineSchema)

module.exports = {
  FavouriteMachine
}