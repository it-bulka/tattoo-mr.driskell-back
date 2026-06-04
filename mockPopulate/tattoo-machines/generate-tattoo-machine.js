const fs = require('fs');
const path = require('path')
const mongoose = require('mongoose');
const { tags, categories, labels } = require('../../app/models/tattoo-machine')
const descriptions = require('./data/descriptions')
const specsData = require('./data/specsList')
const titles = require('./data/titles')
const { Brand } = require('../../app/models/brands');
const { brandPopulate } = require('../brands/brands-populate')


const imageLinks = [
  'tattoo-machines/6de74a0443c150b1b4af366ade05bb68870ccd91_1_4_yzkplv.png',
  'tattoo-machines/6de74a0443c150b1b4af366ade05bb68870ccd91_1_iwetx3.png',
  'tattoo-machines/6de74a0443c150b1b4af366ade05bb68870ccd91_1_3_hdyjzb.png',
  'tattoo-machines/6de74a0443c150b1b4af366ade05bb68870ccd91_1_2_bvkz4h.png',
]

const langs = ['en', 'uk']
const getRandomImages = () => imageLinks.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 2);
const getRandomTag = () => tags.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3));
const getCategory = () => categories[Math.floor(Math.random() * categories.length)]
const getRandomStock = () => Math.floor(Math.random() * 100) + 1;

const getRandomTitle = (category, lang) => {
  if (titles[category] && titles[category][lang] && Array.isArray(titles[category][lang])) {
    return titles[category][lang][Math.floor(Math.random() * titles[category][lang].length)];
  } else {
    console.error(`Titles for category '${category}' and language '${lang}' not found`);
    return "Default Title";  // або будь-який інший значення за замовчуванням
  }
};
const getSpecsForAllLangs = (category) => {
  const categorySpecs = specsData[category]
  if (!categorySpecs || !categorySpecs.en || !categorySpecs.uk) {
    console.log(`No specs data found for category: ${category}`);
    return { en: [], uk: [] }
  }

  const totalSpecs = categorySpecs.en.length
  const minCount = Math.min(3, totalSpecs)
  const count = Math.floor(Math.random() * (totalSpecs - minCount + 1)) + minCount
  const selectedIndices = [...Array(totalSpecs).keys()]
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
    .sort((a, b) => a - b)

  return {
    en: selectedIndices.map(i => ({
      name: categorySpecs.en[i].name,
      value: categorySpecs.en[i].values[Math.floor(Math.random() * categorySpecs.en[i].values.length)]
    })),
    uk: selectedIndices.map(i => ({
      name: categorySpecs.uk[i].name,
      value: categorySpecs.uk[i].values[Math.floor(Math.random() * categorySpecs.uk[i].values.length)]
    }))
  }
}

const getDescription = (category, lang) => {
  if (descriptions[category] && descriptions[category][lang]) {
    const description = descriptions[category][lang];

    const shortDescription = description.shortDescription[Math.floor(Math.random() * description.shortDescription.length)];
    const longDescription = description.longDescription;

    return {
      shortDescription,
      longDescription: longDescription || [],
    };
  } else {
    console.log(`No description data found for category: ${category}, lang: ${lang}`);
    return {
      shortDescription: '',
      longDescription: [],
    }
  }
}

const getRandomLabels = () => {
  const randomCount = Math.floor(Math.random() * (labels.length + 1))
  const shuffledLabels = [...labels].sort(() => Math.random() - 0.5)
  return shuffledLabels.slice(0, randomCount)
}

const getRandomBrandId = (brandsList) => {
  const randomIndex = Math.floor(Math.random() * brandsList.length)
  return brandsList[randomIndex]._id
}

const tattooMachines = [];

const generate = async () => {
  const brands = await brandPopulate()

  if(!brands) {
    console.error('NO brands to populate');
  }
  for (let i = 0; i < 150; i++) {
    const machineId = new mongoose.Types.ObjectId()
    const category = getCategory()

    const price = Math.floor(Math.random() * 5000) + 1000
    const priceCurrent = Math.floor(Math.random() * 9) === 0
      ? null
      : (price - (price / 100 * Math.floor(Math.random() * 20))).toFixed(2);

    const specsForAllLangs = getSpecsForAllLangs(category)

    const machine = {
      _id: machineId,
      images: getRandomImages(),
      brand: getRandomBrandId(brands),
      tags: getRandomTag(),
      category,
      labels: getRandomLabels(),
      price,
      priceCurrent,
      stock: getRandomStock(),

      translations: langs.map((lang) => {
        const description = getDescription(category, lang)

        return {
          _id: new mongoose.Types.ObjectId(),
          lang,
          title: getRandomTitle(category, lang),
          tattooMachineId: machineId,
          shortDescription: description.shortDescription,
          longDescription: description.longDescription,
          specs: specsForAllLangs[lang]
        }
      })
    }
    tattooMachines.push(machine);
  }

  const currentFilePath = __filename
  const newFilePath = path.join(path.dirname(currentFilePath), 'tattooMachines.json')
  fs.writeFileSync(newFilePath, JSON.stringify(tattooMachines, null, 2));
  console.log('Mock data saved to tattooMachines.json');
}

module.exports = {
  generate
}
