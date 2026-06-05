const { PromoCode } = require('../../app/models/promo-codes')
const { PromoCodeTranslation } = require('../../app/models/promo-code-translation')

const promoCodesData = [
  {
    code: 'SUMMER25',
    discountType: 'percentage',
    discountValue: 10,
    discountScope: 'all',
    validFrom: new Date('2026-06-01T00:00:00.000Z'),
    expiresAt: new Date('2026-08-31T23:59:59.000Z'),
    imgUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
    usageLimit: 100,
    minOrderValue: 500,
    translations: {
      uk: {
        title: 'Літній розпродаж',
        description: [
          '10% знижки на весь асортимент!',
          'Поспішайте скористатись пропозицією до кінця серпня — отримайте найкраще за нижчою ціною.'
        ]
      },
      en: {
        title: 'Summer Sale',
        description: [
          '10% off the entire range!',
          'Hurry to use the offer until the end of August — get the best at a lower price.'
        ]
      }
    }
  },
  {
    code: 'TATMACHINE15',
    discountType: 'percentage',
    discountValue: 15,
    discountScope: 'category',
    category: 'tattoo-machines',
    validFrom: new Date('2026-06-01T00:00:00.000Z'),
    expiresAt: new Date('2026-07-31T23:59:59.000Z'),
    imgUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80',
    usageLimit: 50,
    minOrderValue: 1000,
    translations: {
      uk: {
        title: 'Майстер тату-машинок',
        description: [
          '15% знижки на всі тату-машинки!',
          'Час оновити свій інструмент — скористайся промокодом при оформленні замовлення.'
        ]
      },
      en: {
        title: 'Tattoo Machine Master',
        description: [
          '15% off all tattoo machines!',
          'Time to upgrade your gear — use the promo at checkout.'
        ]
      }
    }
  },
  {
    code: 'INK30',
    discountType: 'fixed',
    discountValue: 30,
    discountScope: 'category',
    category: 'tattoo-inks',
    validFrom: new Date('2026-06-01T00:00:00.000Z'),
    expiresAt: new Date('2026-08-31T23:59:59.000Z'),
    imgUrl: 'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=600&q=80',
    usageLimit: 200,
    minOrderValue: 300,
    translations: {
      uk: {
        title: 'Барви літа',
        description: [
          'Знижка 30 грн на тату-фарби!',
          'Поповни палітру улюблених кольорів вигідно — акція діє все літо.'
        ]
      },
      en: {
        title: 'Summer Colors',
        description: [
          '30 UAH off tattoo inks!',
          'Fill your palette with your favorite colors at a great price — valid all summer.'
        ]
      }
    }
  },
  {
    code: 'NEWSEASON5',
    discountType: 'percentage',
    discountValue: 5,
    discountScope: 'period',
    validFrom: new Date('2026-07-01T00:00:00.000Z'),
    expiresAt: new Date('2026-09-30T23:59:59.000Z'),
    imgUrl: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=600&q=80',
    usageLimit: 300,
    minOrderValue: 0,
    translations: {
      uk: {
        title: 'Новий сезон',
        description: [
          '5% знижки на весь асортимент протягом нового сезону!',
          'Сезонний промокод — дійсний з липня по вересень. Не пропусти!'
        ]
      },
      en: {
        title: 'New Season',
        description: [
          '5% off everything during the new season!',
          'Seasonal promo code — valid from July to September. Don\'t miss it!'
        ]
      }
    }
  },
  {
    code: 'NEEDLE20',
    discountType: 'percentage',
    discountValue: 20,
    discountScope: 'category',
    category: 'tattoo-needles',
    validFrom: new Date('2026-06-01T00:00:00.000Z'),
    expiresAt: new Date('2026-12-31T23:59:59.000Z'),
    imgUrl: 'https://images.unsplash.com/photo-1590246814883-55516d4a4f3e?w=600&q=80',
    usageLimit: 150,
    minOrderValue: 200,
    translations: {
      uk: {
        title: 'Голки без переплат',
        description: [
          '20% знижки на тату-голки!',
          'Великий вибір — ще краща ціна. Поповни запас вигідно до кінця року.'
        ]
      },
      en: {
        title: 'Needles Without Overpaying',
        description: [
          '20% off tattoo needles!',
          'Great selection — even better price. Stock up at a discount until year-end.'
        ]
      }
    }
  },
  {
    code: 'POWER10',
    discountType: 'percentage',
    discountValue: 10,
    discountScope: 'category',
    category: 'power-supplies',
    validFrom: new Date('2026-06-01T00:00:00.000Z'),
    expiresAt: new Date('2026-09-30T23:59:59.000Z'),
    imgUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    usageLimit: 80,
    minOrderValue: 800,
    translations: {
      uk: {
        title: 'Енергія татуювання',
        description: [
          '10% знижки на блоки живлення!',
          'Стабільне живлення — стабільний результат. Замовляй зараз і заощаджуй.'
        ]
      },
      en: {
        title: 'Tattoo Power',
        description: [
          '10% off power supplies!',
          'Stable power — stable results. Order now and save.'
        ]
      }
    }
  },
  {
    code: 'BLACKFRIDAY25',
    discountType: 'percentage',
    discountValue: 25,
    discountScope: 'all',
    validFrom: new Date('2026-11-27T00:00:00.000Z'),
    expiresAt: new Date('2026-11-30T23:59:59.000Z'),
    imgUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80',
    usageLimit: 50,
    minOrderValue: 500,
    translations: {
      uk: {
        title: 'Чорна п\'ятниця',
        description: [
          '25% знижки на весь асортимент у Чорну п\'ятницю!',
          'Найбільша знижка року — тільки 27–30 листопада. Підготуйся заздалегідь і заощаджуй по максимуму.'
        ]
      },
      en: {
        title: 'Black Friday',
        description: [
          '25% off everything on Black Friday!',
          'The biggest discount of the year — only November 27–30. Plan ahead and save big.'
        ]
      }
    }
  },
  {
    code: 'STARTER15',
    discountType: 'percentage',
    discountValue: 15,
    discountScope: 'category',
    category: 'tattoo-sets',
    validFrom: new Date('2026-06-01T00:00:00.000Z'),
    expiresAt: new Date('2026-08-31T23:59:59.000Z'),
    imgUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80',
    usageLimit: 75,
    minOrderValue: 600,
    translations: {
      uk: {
        title: 'Старт тату-майстра',
        description: [
          '15% знижки на стартові тату-набори!',
          'Ідеальний вибір для початківців — усе необхідне в одному наборі за вигідною ціною.'
        ]
      },
      en: {
        title: 'Tattoo Master Starter',
        description: [
          '15% off tattoo starter sets!',
          'Perfect for beginners — everything you need in one kit at a great price.'
        ]
      }
    }
  }
]

const populatePromoCode = async () => {
  await PromoCodeTranslation.deleteMany({})
  await PromoCode.deleteMany({})

  const promoCodes = await PromoCode.insertMany(
    promoCodesData.map(({ translations: _t, ...fields }) => fields)
  )

  const translationDocs = promoCodes.flatMap((promoCode, i) => {
    const { translations } = promoCodesData[i]
    return Object.entries(translations).map(([lang, data]) => ({
      lang,
      promoCodeId: promoCode._id,
      title: data.title,
      description: data.description
    }))
  })

  await PromoCodeTranslation.insertMany(translationDocs)
}

module.exports = { populatePromoCode }
