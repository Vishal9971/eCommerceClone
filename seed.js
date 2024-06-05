const Product = require('./models/Product');

let products = [
  {
    name: 'Iphone 5',
    img: 'iphone5.avif',
    price: 20000,
    des: 'apple',
  },
  {
    name: 'Iphone 6',
    img: 'iphone-6.avif',
    price: 30000,
    des: 'apple',
  },
  {
    name: 'Iphone 7',
    img: 'iphone7.avif',
    price: 40000,
    des: 'apple',
  },
  {
    name: 'Iphone 8',
    img: 'iphone8.avif',
    price: 50000,
    des: 'apple',
  },
];

async function seedDB() {
  await Product.insertMany(products);
  console.log('DataBase Connected');
}

module.exports = seedDB;
