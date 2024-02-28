
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const scan = async () => {
  const scanResult = await dynamoDb.scan({ TableName: process.env.PRODUCTS_TABLE }).promise();
  const scanStocksResult = await dynamoDb.scan({ TableName: process.env.STOCKS_TABLE }).promise();

  return { scanResult, scanStocksResult };
};


const getProductsList = async (event) => {
  const { scanResult, scanStocksResult } = await scan();
  scanResult.Items.forEach((product) => {
    const stock = scanStocksResult.Items.find(s => s.product_id === product.id);
    product.count = stock?.count || 0;
  });

  return {
    statusCode: 200,
    body: JSON.stringify(scanResult.Items),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  };
};

module.exports = { getProductsList };
