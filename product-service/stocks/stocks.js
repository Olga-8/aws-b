const products = require('../products/productsList');

const stocks = [
    { product_id: products[0].id, count: 10 },
    { product_id: products[1].id, count: 20 },
    { product_id: products[2].id, count: 5 },
];

module.exports = stocks;