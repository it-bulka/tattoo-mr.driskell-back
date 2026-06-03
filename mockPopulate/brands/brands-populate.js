const { Brand } = require('../../app/models/brands')
const { BrandTranslation } = require('../../app/models/brand-translation')

const generateSlug = (name) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// name — English name (used for both en and uk since brand names are trademarks)
// imgUrl — relative path served from /public, empty string if no image
const brandsData = [
  { name: 'Aliance',                    imgUrl: '' },
  { name: 'Aloe Tattoo',                imgUrl: '/brand-images/tattoo-aloe.png' },
  { name: 'Anchored by Nikko Hurtado',  imgUrl: '' },
  { name: 'BC Invention Company',        imgUrl: '' },
  { name: 'Beauty Bit',                  imgUrl: '' },
  { name: 'Bishop Rotary',              imgUrl: '' },
  { name: 'Burlak Tattoo Machines',     imgUrl: '' },
  { name: 'Cheyenne HAWK',              imgUrl: '/brand-images/cheyenne.png' },
  { name: 'Critical Tattoo',            imgUrl: '' },
  { name: 'Dermalize Protective',       imgUrl: '/brand-images/dermalize.png' },
  { name: 'Dynamic Colors',             imgUrl: '' },
  { name: 'EGO Rotary',                 imgUrl: '' },
  { name: 'Eikon Device Inc.',          imgUrl: '' },
  { name: 'Electrum',                   imgUrl: '' },
  { name: 'EQUALISER by Kwadron',       imgUrl: '' },
  { name: 'Eternal',                    imgUrl: '' },
  { name: 'Excalibur',                  imgUrl: '' },
  { name: 'Face & Body',                imgUrl: '/brand-images/face-body.png' },
  { name: 'Fantasia Art Supply',        imgUrl: '' },
  { name: 'FKirons',                    imgUrl: '' },
  { name: 'Hanafy',                     imgUrl: '/brand-images/hanafy.png' },
  { name: 'HM Tattoo Machines',         imgUrl: '' },
  { name: 'Ink Machines',               imgUrl: '/brand-images/ink-machines.png' },
  { name: 'InkJecta Tattoo Machine',    imgUrl: '' },
  { name: 'Intenze',                    imgUrl: '' },
  { name: 'JACK & ALEXX',               imgUrl: '' },
  { name: 'Kashalot Rotary',            imgUrl: '' },
  { name: 'Kuro Sumi',                  imgUrl: '/brand-images/kuro-sumi.png' },
  { name: 'KWADRON',                    imgUrl: '/brand-images/kwadron.png' },
  { name: 'Lauro Paolini',              imgUrl: '' },
  { name: 'Lithuanian Irons',           imgUrl: '' },
  { name: 'Lucky Supply',               imgUrl: '' },
  { name: 'Mercator Medical',           imgUrl: '' },
  { name: 'Millenium Moms Ink',         imgUrl: '' },
  { name: 'NEMESIS',                    imgUrl: '' },
  { name: 'Nocturnal Tattoo Ink',       imgUrl: '' },
  { name: 'Ocean',                      imgUrl: '/brand-images/ocean.png' },
  { name: 'Panthera',                   imgUrl: '' },
  { name: 'Perma Blend',                imgUrl: '' },
  { name: 'Precision Needles',          imgUrl: '' },
  { name: 'Precision Tattoo Supply',    imgUrl: '' },
  { name: 'Premier Products',           imgUrl: '' },
  { name: 'Radiant',                    imgUrl: '' },
  { name: 'Reprofx Spirit',             imgUrl: '' },
  { name: 'Right Stuff',                imgUrl: '' },
  { name: 'S8TATTOO',                   imgUrl: '' },
  { name: 'Skinductor',                 imgUrl: '' },
  { name: 'Starbrite',                  imgUrl: '' },
  { name: 'Tattoorevive',               imgUrl: '/brand-images/tattoo-revive.png' },
  { name: 'TURANIUM Fabrika Rotary',    imgUrl: '' },
  { name: 'UNI-CART',                   imgUrl: '' },
  { name: 'Vlad Blad',                  imgUrl: '' },
  { name: 'World Famous Bala',          imgUrl: '' },
  { name: 'World Famous Tattoo Ink',    imgUrl: '' },
  { name: '2K2BT',                      imgUrl: '' },
]

const brandPopulate = async () => {
  try {
    await BrandTranslation.deleteMany({})
    await Brand.deleteMany({})

    const brandDocs = brandsData.map(({ name, imgUrl }) => ({
      slug: generateSlug(name),
      imgUrl,
      defaultLang: 'en'
    }))

    const brands = await Brand.insertMany(brandDocs)

    const translations = brands.flatMap((brand, i) => [
      { lang: 'en', brandId: brand._id, name: brandsData[i].name },
      { lang: 'uk', brandId: brand._id, name: brandsData[i].name },
    ])

    await BrandTranslation.insertMany(translations)

    return brands
  } catch (error) {
    console.error('Error while populating brands:', error)
  }
}

module.exports = { brandPopulate }
