const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();


const scan = async () => {
  const scanResult = await dynamoDb.scan({ TableName: process.env.PRODUCTS_TABLE }).promise();
  return scanResult;
};

const query = async (id) => {
  
  const params = {
    TableName: process.env.PRODUCTS_TABLE,
    KeyConditionExpression: 'id = :id',
    ExpressionAttributeValues: { ':id': id },
  };

  const queryResult = await dynamoDb.query(params).promise();
  return queryResult;
};

const put = async (product) => {
  const params = {
    TableName: process.env.PRODUCTS_TABLE,
    Item: product,
  };
  await dynamoDb.put(params).promise();
};

const createProducts = async (event) => {
  const scanResult = await scan();
  const queryResult = await query('0'); 
  
  const item = { id: '1', title: "title!", price: 100, description: "description" };
  await put(item);
  
  const scanResult2 = await scan();
  return {
    statusCode: 404,
    body: JSON.stringify({ scanResult, queryResult, scanResult2 }),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
  };
};

module.exports = { createProducts };
