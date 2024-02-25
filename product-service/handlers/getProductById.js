const products = require('../products/productsList');

const getProductById = async (event) => {
  const productId = event.pathParameters.id;
  const product = products.find(p => p.id === productId);

  if (!product) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Product not found' }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(product),
    headers: {
      'Content-Type': 'application/json',
    },
  };
}
module.exports = { getProductById };
