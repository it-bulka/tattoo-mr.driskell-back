const specsData = {
  'tattoo-sets': {
    en: {
      motorType: ['Coreless Motor', 'Rotary Motor', 'Linear Motor', 'Digital Motor'],
      voltage: ['6V', '7V', '8V', '9V'],
      frequency: ['50 Hz', '60 Hz', '70 Hz', '80 Hz'],
      weight: ['150g', '200g', '250g', '300g'],
      material: ['Aluminum', 'Steel', 'Plastic', 'Wood'],
      color: ['Black', 'Silver', 'Red', 'Blue'],
      size: ['Small', 'Medium', 'Large', 'Extra Large'],
    },
    uk: {
      motorType: ['Безщітковий мотор', 'Роторний мотор', 'Лінійний мотор', 'Цифровий мотор'],
      voltage: ['6В', '7В', '8В', '9В'],
      frequency: ['50 Гц', '60 Гц', '70 Гц', '80 Гц'],
      weight: ['150г', '200г', '250г', '300г'],
      material: ['Алюміній', 'Сталь', 'Пластик', 'Дерево'],
      color: ['Чорний', 'Сріблястий', 'Червоний', 'Синій'],
      size: ['Малий', 'Середній', 'Великий', 'Дуже великий'],
    },
  },
  'tattoo-machines': {
    en: {
      motorType: ['Coreless Motor', 'Rotary Motor', 'Linear Motor', 'Digital Motor'],
      voltage: ['6V', '7V', '8V', '9V', '12V'],
      weight: ['150g', '200g', '250g', '300g'],
      speed: ['10,000 RPM', '12,000 RPM', '15,000 RPM', '20,000 RPM'],
      strokeLength: ['2.5mm', '3.0mm', '3.5mm', '4.0mm'],
      gripType: ['Ergonomic', 'Slim', 'Anti-Slip', 'Rubber'],
      material: ['Aluminum', 'Stainless Steel', 'Plastic', 'Carbon Fiber'],
      color: ['Black', 'Silver', 'Red', 'Blue'],
    },
    uk: {
      motorType: ['Безщітковий мотор', 'Роторний мотор', 'Лінійний мотор', 'Цифровий мотор'],
      voltage: ['6В', '7В', '8В', '9В', '12В'],
      weight: ['150г', '200г', '250г', '300г'],
      speed: ['10,000 об/хв', '12,000 об/хв', '15,000 об/хв', '20,000 об/хв'],
      strokeLength: ['2.5мм', '3.0мм', '3.5мм', '4.0мм'],
      gripType: ['Ергономічний', 'Тонкий', 'Протиковзкий', 'Гумовий'],
      material: ['Алюміній', 'Нержавіюча сталь', 'Пластик', 'Вуглецеве волокно'],
      color: ['Чорний', 'Сріблястий', 'Червоний', 'Синій'],
    },
  },
  'tattoo-inks': {
    en: {
      inkType: ['Black', 'Colored', 'Shading', 'White'],
      volume: ['30ml', '50ml', '100ml', '200ml'],
      brand: ['Brand A', 'Brand B', 'Brand C', 'Brand D'],
      shelfLife: ['1 Year', '2 Years', '3 Years', '5 Years'],
      sterilization: ['Gamma Radiation', 'Ethylene Oxide', 'Autoclave', 'UV Light'],
      material: ['Vegan', 'Non-Vegan', 'Organic', 'Synthetic'],
      colorsAvailable: ['Red', 'Blue', 'Green', 'Yellow'],
    },
    uk: {
      inkType: ['Чорний', 'Кольоровий', 'Тінь', 'Білий'],
      volume: ['30мл', '50мл', '100мл', '200мл'],
      brand: ['Бренд A', 'Бренд B', 'Бренд C', 'Бренд D'],
      shelfLife: ['1 рік', '2 роки', '3 роки', '5 років'],
      sterilization: ['Гамма-радіація', 'Етиленоксид', 'Автоклав', 'УФ світло'],
      material: ['Веганський', 'Не веганський', 'Органічний', 'Синтетичний'],
      colorsAvailable: ['Червоний', 'Синій', 'Зелений', 'Жовтий'],
    },
  },
  'tattoo-needles': {
    en: {
      needleSize: ['0.25mm', '0.30mm', '0.35mm', '0.40mm'],
      needleType: ['Round Liner', 'Round Shader', 'Flat', 'Magnum'],
      material: ['Stainless Steel', 'Nickel Plated', 'Titanium', 'Carbon Steel'],
      sterilization: ['Gamma Radiation', 'Ethylene Oxide', 'Autoclave', 'Ozone'],
      quantityPerBox: ['10', '20', '50', '100'],
      gripType: ['Soft', 'Hard', 'Ergonomic', 'Slim'],
      color: ['Silver', 'Black', 'Blue', 'Red'],
      safety: ['Single-Use', 'Reusable', 'Sterile', 'Non-Sterile'],
    },
    uk: {
      needleSize: ['0.25мм', '0.30мм', '0.35мм', '0.40мм'],
      needleType: ['Круглий Лайнер', 'Круглий Шейдер', 'Плоский', 'Магнум'],
      material: ['Нержавіюча сталь', 'Нікелеве покриття', 'Титан', 'Вуглецева сталь'],
      sterilization: ['Гамма-радіація', 'Етиленоксид', 'Автоклав', 'Озон'],
      quantityPerBox: ['10', '20', '50', '100'],
      gripType: ['М\'який', 'Жорсткий', 'Ергономічний', 'Тонкий'],
      color: ['Срібний', 'Чорний', 'Синій', 'Червоний'],
      safety: ['Для одноразового використання', 'Переробний', 'Стерильний', 'Нестерильний'],
    },
  },
  'tattoo-holders': {
    en: {
      material: ['Aluminum', 'Steel', 'Plastic', 'Rubber'],
      size: ['Small', 'Medium', 'Large', 'Extra Large'],
      compatibility: ['Universal', 'For Specific Machines'],
      weight: ['100g', '150g', '200g', '250g'],
      color: ['Black', 'Red', 'Blue', 'Silver'],
    },
    uk: {
      material: ['Алюміній', 'Сталь', 'Пластик', 'Гума'],
      size: ['Малий', 'Середній', 'Великий', 'Дуже великий'],
      compatibility: ['Універсальний', 'Для конкретних машин'],
      weight: ['100г', '150г', '200г', '250г'],
      color: ['Чорний', 'Червоний', 'Синій', 'Сріблястий'],
    },
  },
  'tattoo-tips': {
    en: {
      size: ['0.25mm', '0.30mm', '0.35mm', '0.40mm'],
      material: ['Stainless Steel', 'Plastic', 'Rubber', 'Aluminum'],
      color: ['Black', 'Silver', 'Red', 'Blue'],
      compatibility: ['Universal', 'Specific', 'Custom'],
    },
    uk: {
      size: ['0.25мм', '0.30мм', '0.35мм', '0.40мм'],
      material: ['Нержавіюча сталь', 'Пластик', 'Гума', 'Алюміній'],
      color: ['Чорний', 'Сріблястий', 'Червоний', 'Синій'],
      compatibility: ['Універсальний', 'Спеціальний', 'Індивідуальний'],
    },
  },
  'power-supplies': {
    en: {
      voltage: ['5V', '6V', '9V', '12V'],
      wattage: ['10W', '20W', '30W', '40W'],
      type: ['Digital', 'Analog'],
      weight: ['300g', '400g', '500g', '600g'],
      compatibility: ['Universal', 'For Specific Machines'],
    },
    uk: {
      voltage: ['5В', '6В', '9В', '12В'],
      wattage: ['10Вт', '20Вт', '30Вт', '40Вт'],
      type: ['Цифровий', 'Аналоговий'],
      weight: ['300г', '400г', '500г', '600г'],
      compatibility: ['Універсальний', 'Для конкретних машин'],
    },
  },
  'pedals-and-wires': {
    en: {
      type: ['Foot Pedal', 'Clip Cord', 'RCA Cable', 'USB Cable'],
      length: ['1m', '1.5m', '2m', '2.5m'],
      material: ['Rubber', 'Plastic', 'Metal'],
      color: ['Black', 'Red', 'Blue'],
    },
    uk: {
      type: ['Педаль для ноги', 'Кліп-корд', 'RCA кабель', 'USB кабель'],
      length: ['1м', '1.5м', '2м', '2.5м'],
      material: ['Гума', 'Пластик', 'Метал'],
      color: ['Чорний', 'Червоний', 'Синій'],
    },
  },
  'accessories': {
    en: {
      type: ['Cables', 'Needle Holders', 'Grip Covers', 'Machine Bags'],
      material: ['Plastic', 'Rubber', 'Aluminum', 'Leather'],
      size: ['Small', 'Medium', 'Large', 'Extra Large'],
    },
    uk: {
      type: ['Кабелі', 'Тримачі для голок', 'Накладки для ручок', 'Мішки для машинок'],
      material: ['Пластик', 'Гума', 'Алюміній', 'Шкіра'],
      size: ['Малий', 'Середній', 'Великий', 'Дуже великий'],
    },
  },
  'printers-and-tablets': {
    en: {
      type: ['Printer', 'Tablet'],
      size: ['A4', 'A3', 'Custom'],
      material: ['Plastic', 'Metal'],
      compatibility: ['Windows', 'Mac'],
      color: ['Black', 'White'],
    },
    uk: {
      type: ['Принтер', 'Планшет'],
      size: ['A4', 'A3', 'Індивідуальний'],
      material: ['Пластик', 'Метал'],
      compatibility: ['Windows', 'Mac'],
      color: ['Чорний', 'Білий'],
    },
  },
  'protection-containers-consumables': {
    en: {
      type: ['Plastic Box', 'Storage Case', 'Rubber Container'],
      material: ['Plastic', 'Rubber', 'Metal'],
      capacity: ['500ml', '1L', '2L'],
      color: ['Black', 'Red', 'Blue'],
    },
    uk: {
      type: ['Пластикова коробка', 'Контейнер для зберігання', 'Резиновий контейнер'],
      material: ['Пластик', 'Резина', 'Метал'],
      capacity: ['500мл', '1л', '2л'],
      color: ['Чорний', 'Червоний', 'Синій'],
    },
  }
}

module.exports = specsData