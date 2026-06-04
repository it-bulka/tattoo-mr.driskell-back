const specsData = {
  'tattoo-sets': {
    en: [
      { name: 'Motor type', values: ['Coreless Motor', 'Rotary Motor', 'Linear Motor', 'Digital Motor'] },
      { name: 'Voltage', values: ['6V', '7V', '8V', '9V'] },
      { name: 'Frequency', values: ['50 Hz', '60 Hz', '70 Hz', '80 Hz'] },
      { name: 'Weight', values: ['150g', '200g', '250g', '300g'] },
      { name: 'Material', values: ['Aluminum', 'Steel', 'Plastic', 'Wood'] },
      { name: 'Color', values: ['Black', 'Silver', 'Red', 'Blue'] },
      { name: 'Size', values: ['Small', 'Medium', 'Large', 'Extra Large'] },
    ],
    uk: [
      { name: 'Тип мотору', values: ['Безщітковий мотор', 'Роторний мотор', 'Лінійний мотор', 'Цифровий мотор'] },
      { name: 'Напруга', values: ['6В', '7В', '8В', '9В'] },
      { name: 'Частота', values: ['50 Гц', '60 Гц', '70 Гц', '80 Гц'] },
      { name: 'Вага', values: ['150г', '200г', '250г', '300г'] },
      { name: 'Матеріал', values: ['Алюміній', 'Сталь', 'Пластик', 'Дерево'] },
      { name: 'Колір', values: ['Чорний', 'Сріблястий', 'Червоний', 'Синій'] },
      { name: 'Розмір', values: ['Малий', 'Середній', 'Великий', 'Дуже великий'] },
    ],
  },
  'tattoo-machines': {
    en: [
      { name: 'Motor type', values: ['Coreless Motor', 'Rotary Motor', 'Linear Motor', 'Digital Motor'] },
      { name: 'Voltage', values: ['6V', '7V', '8V', '9V', '12V'] },
      { name: 'Weight', values: ['150g', '200g', '250g', '300g'] },
      { name: 'Speed', values: ['10,000 RPM', '12,000 RPM', '15,000 RPM', '20,000 RPM'] },
      { name: 'Stroke length', values: ['2.5mm', '3.0mm', '3.5mm', '4.0mm'] },
      { name: 'Grip type', values: ['Ergonomic', 'Slim', 'Anti-Slip', 'Rubber'] },
      { name: 'Material', values: ['Aluminum', 'Stainless Steel', 'Plastic', 'Carbon Fiber'] },
      { name: 'Color', values: ['Black', 'Silver', 'Red', 'Blue'] },
    ],
    uk: [
      { name: 'Тип мотору', values: ['Безщітковий мотор', 'Роторний мотор', 'Лінійний мотор', 'Цифровий мотор'] },
      { name: 'Напруга', values: ['6В', '7В', '8В', '9В', '12В'] },
      { name: 'Вага', values: ['150г', '200г', '250г', '300г'] },
      { name: 'Швидкість', values: ['10,000 об/хв', '12,000 об/хв', '15,000 об/хв', '20,000 об/хв'] },
      { name: 'Довжина ходу', values: ['2.5мм', '3.0мм', '3.5мм', '4.0мм'] },
      { name: 'Тип ручки', values: ['Ергономічний', 'Тонкий', 'Протиковзкий', 'Гумовий'] },
      { name: 'Матеріал', values: ['Алюміній', 'Нержавіюча сталь', 'Пластик', 'Вуглецеве волокно'] },
      { name: 'Колір', values: ['Чорний', 'Сріблястий', 'Червоний', 'Синій'] },
    ],
  },
  'tattoo-inks': {
    en: [
      { name: 'Ink type', values: ['Black', 'Colored', 'Shading', 'White'] },
      { name: 'Volume', values: ['30ml', '50ml', '100ml', '200ml'] },
      { name: 'Shelf life', values: ['1 Year', '2 Years', '3 Years', '5 Years'] },
      { name: 'Sterilization', values: ['Gamma Radiation', 'Ethylene Oxide', 'Autoclave', 'UV Light'] },
      { name: 'Material', values: ['Vegan', 'Non-Vegan', 'Organic', 'Synthetic'] },
      { name: 'Colors available', values: ['Red', 'Blue', 'Green', 'Yellow'] },
    ],
    uk: [
      { name: 'Тип чорнила', values: ['Чорний', 'Кольоровий', 'Тінь', 'Білий'] },
      { name: 'Об\'єм', values: ['30мл', '50мл', '100мл', '200мл'] },
      { name: 'Термін придатності', values: ['1 рік', '2 роки', '3 роки', '5 років'] },
      { name: 'Стерилізація', values: ['Гамма-радіація', 'Етиленоксид', 'Автоклав', 'УФ світло'] },
      { name: 'Матеріал', values: ['Веганський', 'Не веганський', 'Органічний', 'Синтетичний'] },
      { name: 'Доступні кольори', values: ['Червоний', 'Синій', 'Зелений', 'Жовтий'] },
    ],
  },
  'tattoo-needles': {
    en: [
      { name: 'Needle size', values: ['0.25mm', '0.30mm', '0.35mm', '0.40mm'] },
      { name: 'Needle type', values: ['Round Liner', 'Round Shader', 'Flat', 'Magnum'] },
      { name: 'Material', values: ['Stainless Steel', 'Nickel Plated', 'Titanium', 'Carbon Steel'] },
      { name: 'Sterilization', values: ['Gamma Radiation', 'Ethylene Oxide', 'Autoclave', 'Ozone'] },
      { name: 'Quantity per box', values: ['10', '20', '50', '100'] },
      { name: 'Grip type', values: ['Soft', 'Hard', 'Ergonomic', 'Slim'] },
      { name: 'Color', values: ['Silver', 'Black', 'Blue', 'Red'] },
      { name: 'Safety', values: ['Single-Use', 'Reusable', 'Sterile', 'Non-Sterile'] },
    ],
    uk: [
      { name: 'Розмір голки', values: ['0.25мм', '0.30мм', '0.35мм', '0.40мм'] },
      { name: 'Тип голки', values: ['Круглий Лайнер', 'Круглий Шейдер', 'Плоский', 'Магнум'] },
      { name: 'Матеріал', values: ['Нержавіюча сталь', 'Нікелеве покриття', 'Титан', 'Вуглецева сталь'] },
      { name: 'Стерилізація', values: ['Гамма-радіація', 'Етиленоксид', 'Автоклав', 'Озон'] },
      { name: 'Кількість в упаковці', values: ['10', '20', '50', '100'] },
      { name: 'Тип ручки', values: ['М\'який', 'Жорсткий', 'Ергономічний', 'Тонкий'] },
      { name: 'Колір', values: ['Срібний', 'Чорний', 'Синій', 'Червоний'] },
      { name: 'Безпека', values: ['Для одноразового використання', 'Переробний', 'Стерильний', 'Нестерильний'] },
    ],
  },
  'tattoo-holders': {
    en: [
      { name: 'Material', values: ['Aluminum', 'Steel', 'Plastic', 'Rubber'] },
      { name: 'Size', values: ['Small', 'Medium', 'Large', 'Extra Large'] },
      { name: 'Compatibility', values: ['Universal', 'For Specific Machines'] },
      { name: 'Weight', values: ['100g', '150g', '200g', '250g'] },
      { name: 'Color', values: ['Black', 'Red', 'Blue', 'Silver'] },
    ],
    uk: [
      { name: 'Матеріал', values: ['Алюміній', 'Сталь', 'Пластик', 'Гума'] },
      { name: 'Розмір', values: ['Малий', 'Середній', 'Великий', 'Дуже великий'] },
      { name: 'Сумісність', values: ['Універсальний', 'Для конкретних машин'] },
      { name: 'Вага', values: ['100г', '150г', '200г', '250г'] },
      { name: 'Колір', values: ['Чорний', 'Червоний', 'Синій', 'Сріблястий'] },
    ],
  },
  'tattoo-tips': {
    en: [
      { name: 'Size', values: ['0.25mm', '0.30mm', '0.35mm', '0.40mm'] },
      { name: 'Material', values: ['Stainless Steel', 'Plastic', 'Rubber', 'Aluminum'] },
      { name: 'Color', values: ['Black', 'Silver', 'Red', 'Blue'] },
      { name: 'Compatibility', values: ['Universal', 'Specific', 'Custom'] },
    ],
    uk: [
      { name: 'Розмір', values: ['0.25мм', '0.30мм', '0.35мм', '0.40мм'] },
      { name: 'Матеріал', values: ['Нержавіюча сталь', 'Пластик', 'Гума', 'Алюміній'] },
      { name: 'Колір', values: ['Чорний', 'Сріблястий', 'Червоний', 'Синій'] },
      { name: 'Сумісність', values: ['Універсальний', 'Спеціальний', 'Індивідуальний'] },
    ],
  },
  'power-supplies': {
    en: [
      { name: 'Voltage', values: ['5V', '6V', '9V', '12V'] },
      { name: 'Wattage', values: ['10W', '20W', '30W', '40W'] },
      { name: 'Type', values: ['Digital', 'Analog'] },
      { name: 'Weight', values: ['300g', '400g', '500g', '600g'] },
      { name: 'Compatibility', values: ['Universal', 'For Specific Machines'] },
    ],
    uk: [
      { name: 'Напруга', values: ['5В', '6В', '9В', '12В'] },
      { name: 'Потужність', values: ['10Вт', '20Вт', '30Вт', '40Вт'] },
      { name: 'Тип', values: ['Цифровий', 'Аналоговий'] },
      { name: 'Вага', values: ['300г', '400г', '500г', '600г'] },
      { name: 'Сумісність', values: ['Універсальний', 'Для конкретних машин'] },
    ],
  },
  'pedals-and-wires': {
    en: [
      { name: 'Type', values: ['Foot Pedal', 'Clip Cord', 'RCA Cable', 'USB Cable'] },
      { name: 'Length', values: ['1m', '1.5m', '2m', '2.5m'] },
      { name: 'Material', values: ['Rubber', 'Plastic', 'Metal'] },
      { name: 'Color', values: ['Black', 'Red', 'Blue'] },
    ],
    uk: [
      { name: 'Тип', values: ['Педаль для ноги', 'Кліп-корд', 'RCA кабель', 'USB кабель'] },
      { name: 'Довжина', values: ['1м', '1.5м', '2м', '2.5м'] },
      { name: 'Матеріал', values: ['Гума', 'Пластик', 'Метал'] },
      { name: 'Колір', values: ['Чорний', 'Червоний', 'Синій'] },
    ],
  },
  'accessories': {
    en: [
      { name: 'Type', values: ['Cables', 'Needle Holders', 'Grip Covers', 'Machine Bags'] },
      { name: 'Material', values: ['Plastic', 'Rubber', 'Aluminum', 'Leather'] },
      { name: 'Size', values: ['Small', 'Medium', 'Large', 'Extra Large'] },
    ],
    uk: [
      { name: 'Тип', values: ['Кабелі', 'Тримачі для голок', 'Накладки для ручок', 'Мішки для машинок'] },
      { name: 'Матеріал', values: ['Пластик', 'Гума', 'Алюміній', 'Шкіра'] },
      { name: 'Розмір', values: ['Малий', 'Середній', 'Великий', 'Дуже великий'] },
    ],
  },
  'printers-and-tablets': {
    en: [
      { name: 'Type', values: ['Printer', 'Tablet'] },
      { name: 'Size', values: ['A4', 'A3', 'Custom'] },
      { name: 'Material', values: ['Plastic', 'Metal'] },
      { name: 'Compatibility', values: ['Windows', 'Mac'] },
      { name: 'Color', values: ['Black', 'White'] },
    ],
    uk: [
      { name: 'Тип', values: ['Принтер', 'Планшет'] },
      { name: 'Розмір', values: ['A4', 'A3', 'Індивідуальний'] },
      { name: 'Матеріал', values: ['Пластик', 'Метал'] },
      { name: 'Сумісність', values: ['Windows', 'Mac'] },
      { name: 'Колір', values: ['Чорний', 'Білий'] },
    ],
  },
  'protection-containers-consumables': {
    en: [
      { name: 'Type', values: ['Plastic Box', 'Storage Case', 'Rubber Container'] },
      { name: 'Material', values: ['Plastic', 'Rubber', 'Metal'] },
      { name: 'Capacity', values: ['500ml', '1L', '2L'] },
      { name: 'Color', values: ['Black', 'Red', 'Blue'] },
    ],
    uk: [
      { name: 'Тип', values: ['Пластикова коробка', 'Контейнер для зберігання', 'Резиновий контейнер'] },
      { name: 'Матеріал', values: ['Пластик', 'Резина', 'Метал'] },
      { name: 'Місткість', values: ['500мл', '1л', '2л'] },
      { name: 'Колір', values: ['Чорний', 'Червоний', 'Синій'] },
    ],
  }
}

module.exports = specsData
