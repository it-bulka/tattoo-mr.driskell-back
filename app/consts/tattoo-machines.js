const compatibleSets = {
  'tattoo-machines': ['tattoo-needles', 'tattoo-inks', 'power-supplies', 'pedals-and-wires', 'accessories', 'tattoo-sets'],
  'tattoo-sets': ['tattoo-inks', 'tattoo-needles', 'accessories', 'tattoo-machines'],
  'tattoo-inks': ['tattoo-machines', 'tattoo-needles', 'accessories', 'tattoo-sets'],
  'tattoo-needles': ['tattoo-machines', 'tattoo-inks', 'accessories', 'tattoo-sets'],
  'tattoo-holders': ['tattoo-machines', 'pedals-and-wires', 'accessories'],
  'tattoo-tips': ['tattoo-machines', 'tattoo-needles', 'tattoo-inks'],
  'power-supplies': ['tattoo-machines', 'pedals-and-wires', 'tattoo-needles', 'tattoo-inks', 'accessories'],
  'pedals-and-wires': ['tattoo-machines', 'power-supplies', 'tattoo-holders', 'accessories'],
  'accessories': ['tattoo-machines', 'tattoo-needles', 'tattoo-inks', 'tattoo-sets', 'pedals-and-wires', 'power-supplies', 'tattoo-holders'],
  'printers-and-tablets': ['accessories', 'tattoo-sets'],
  'protection-containers-consumables': ['tattoo-machines', 'tattoo-needles', 'tattoo-inks', 'accessories']
}

const specsPropertyList = {
  'tattoo-sets': [
    'motorType',
    'voltage',
    'frequency',
    'weight',
    'material',
    'color',
    'size'
  ],
  'tattoo-machines': [
    'motorType',
    'voltage',
    'weight',
    'speed',
    'strokeLength',
    'gripType',
    'material',
    'color'
  ],
  'tattoo-inks': [
    'inkType',
    'volume',
    'brand',
    'shelfLife',
    'sterilization',
    'material',
    'colorsAvailable'
  ],
  'tattoo-needles': [
    'needleSize',
    'needleType',
    'material',
    'sterilization',
    'quantityPerBox',
    'gripType',
    'color',
    'safety'
  ],
  'tattoo-holders': [
    'material',
    'size',
    'compatibility',
    'weight',
    'color'
  ],
  'tattoo-tips': [
    'size',
    'material',
    'color',
    'compatibility'
  ],
  'power-supplies': [
    'voltage',
    'wattage',
    'type',
    'weight',
    'compatibility'
  ],
  'pedals-and-wires': [
    'type',
    'length',
    'material',
    'color'
  ],
  'accessories': [
    'type',
    'material',
    'size'
  ],
  'printers-and-tablets': [
    'type',
    'size',
    'material',
    'compatibility',
    'color'
  ],
  'protection-containers-consumables': [
    'type',
    'material',
    'capacity',
    'color'
  ]
}

module.exports = {
  compatibleSets,
  specsPropertyList
}