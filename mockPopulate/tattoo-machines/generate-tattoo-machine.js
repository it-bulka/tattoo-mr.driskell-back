const fs = require('fs');
const mongoose = require('mongoose');
const { tags, categories } = require('../../app/models/tattoo-machine')

const imageLinks = [
  'tattoo-machines/6de74a0443c150b1b4af366ade05bb68870ccd91_1_4_yzkplv.png',
  'tattoo-machines/6de74a0443c150b1b4af366ade05bb68870ccd91_1_iwetx3.png',
  'tattoo-machines/6de74a0443c150b1b4af366ade05bb68870ccd91_1_3_hdyjzb.png',
  'tattoo-machines/6de74a0443c150b1b4af366ade05bb68870ccd91_1_2_bvkz4h.png',
]

const langs = ['en', 'uk'];
const titles = {
  en: ['Pro Shader', 'Liner Beast', 'Smooth Operator', 'Precision Master', 'Steady Stroke'],
  uk: ['Професійний Шейдер', 'Лайнер Звір', 'Гладкий Оператор', 'Майстер Точності', 'Стабільний Хід']
}
const getRandomTitle = (lang) => titles[lang][Math.floor(Math.random() * titles[lang].length)]

const getRandomImages = () => imageLinks.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 2);
const getRandomTag = () => tags.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3));
const getRandomCategories = () => categories.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3));

const tattooMachines = [];

for (let i = 0; i < 50; i++) {
  const machineId = new mongoose.Types.ObjectId();
  const machine = {
    _id: machineId,
    images: getRandomImages(),
    tags: getRandomTag(),
    categories: getRandomCategories(),
    translations: langs.map((lang) => ({
      _id: new mongoose.Types.ObjectId(),
      lang,
      title: getRandomTitle(lang),
      price: Math.floor(Math.random() * 5000) + 1000,
      tattooMachineId: machineId,
    })),
  };
  tattooMachines.push(machine);
}

fs.writeFileSync('tattooMachines.json', JSON.stringify(tattooMachines, null, 2));
console.log('Mock data saved to tattooMachines.json');
