const products = require('../products/productsList');

const getProductsList = async (event) => {

  return {
    statusCode: 200,
    body: JSON.stringify(products),
    headers: {
      'Content-Type': 'application/json',
    },
  };
}

module.exports = { getProductsList };
