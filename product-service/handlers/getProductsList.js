const products = require('../products/productsList');

const getProductsList = async (event) => {

  return {
    statusCode: 200,
    body: JSON.stringify(products),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
  };
}

module.exports = { getProductsList };
