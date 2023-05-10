const foodColors = {
    'Ash': '#2F313D',
    'Carbohydrate': '#E9793C',
    'Fat': '#ECA72C',
    'Fatty Acid': '#E54B4B',
    'Fiber': '#028090',
    'Proteins': '#447604'
} as {[key: string]: string};

const bordeau = '#B6393B';
const red = '#B73229';
const orange = '#F3854D';
const yellow = '#FFC900';
const lightGreen = '#8BC349';
const green = '#3A833C';
const lightBlue = '429BE0';
const blue = '#1970B7';
const indigo = '#364591';
const violet = '#763691';
const purple = '#913670';
const pink = '#AC5875';
const brown = '#916930';
const gray = '#797B6D';
const black = '#2F313D';

const allergyColors = {
    'Allium Allergy': purple,
    'Alpha-gal Syndrome': bordeau,
    'Cruciferous Allergy': green,
    'Fish Allergy': blue,
    'Hypersensitivity': yellow,
    'Lactose intolerance': pink,
    'Legume Allergy': lightGreen,
    'Oral Allergy Syndrome': brown,
    'Salicylate Allergy': red,
    'Stone Fruit Allergy': orange,
    'Beer Allergy': yellow,
    'Pepper Allergy': black,
    'Rice Allergy': brown,
    'Thyroid': purple,
    'Tannin Allergy': bordeau,
    'Banana Allergy': yellow,
    'Ochratoxin Allergy': red,
    'Broccoli allergy': green,
    'Lactose Intolerance': pink,
    'Aquagenic Urticaria': lightBlue,
    'Peanut Allergy': orange,
    'Ragweed Allergy': lightGreen,
    'Shellfish Allergy': gray,
    'Soy Allergy': green,
    'LTP Allergy': orange,
    'Mushroom Allergy': gray,
    'Honey Allergy': yellow,
    'Mint Allergy': lightGreen,
    'Nightshade Allergy': black,
    'Corn Allergy': yellow,
    'Poultry Allergy': brown,
    'Gluten Allergy': violet,
    'Seed Allergy': violet,
    'Potato Allergy': brown,
    'Nut Allergy': blue,
    'Insulin Allergy': indigo,
    'Sugar Allergy / Intolerance': gray,
    'Citrus Allergy': yellow,
    'Histamine Allergy': violet,
    'Milk allergy / Lactose intolerance': pink,

} as {[key: string]: string};

export { foodColors, allergyColors };