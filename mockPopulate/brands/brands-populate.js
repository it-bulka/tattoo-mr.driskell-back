const { Brand } = require('../../app/models/brands')

const brandsList = [
  'Aliance', 'Aloe Tattoo', 'Anchored by Nikko Hurtado', 'BC Invention Comrany', 'Beauty Bit', 'Bishop Rotary', 'Burlak Tattoo Machines', 'Cheyenne HAWK', 'Critical Tattoo', 'Dermalize Protective', 'Dynamic Colors',
  'EGO Bez’s Rotary', 'Eikon Device Inc.', 'Electrum', 'EQUALISER by Kwadron', 'Eternal', 'Excalibur', 'Fantasia Art Supply', 'FKirons', 'Hanafy', 'HM Tattoo Machines', 'Ink Machines',
  'InkJecta Tattoo Machine', 'Intenze', 'JACK & ALEXX', 'Kashalot Rotary', 'Kuro Sumi', 'KWADRON™', 'Lauro Paolini', 'Lithuanian Irons', 'Lucky Supply', 'Mercator Medical', 'Millenium Mom’s Ink',
  'NEMESIS', 'Nocturnal Tattoo Ink', 'Panthera', 'Perma Blend', 'Precision Needles', 'Precision Tattoo Supply', 'Premier Products', 'Radiant', 'Reprofx® Spirit™', 'Right Stuuf', 'S8TATTOO',
  'Skinductor', 'Starbrite', 'Tattoorevive', 'TURANIUM Fabrika Rotary', 'UNI–CART', 'Vlad Blad', 'World Famous Bala', 'World Famous Tattoo Ink', '2K2BT'
]

const brandPopulate = async () => {
  try {
    await Brand.deleteMany({})

    const brands = brandsList.map(brandName => ({ name: brandName }))
    const result = await Brand.insertMany(brands)

    return result
  } catch (error) {
    console.error('Error while populating brands:', error);
  }
}

module.exports = {
  brandPopulate
}

