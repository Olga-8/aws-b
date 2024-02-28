const AWS = require('aws-sdk');
const uuid = require('uuid');
const products = require('./products/productsList');
const stocks = require('./stocks/stocks');

AWS.config.update({
    region: 'eu-west-1',
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const productsTable = 'products';
const stocksTable = 'stocks';

async function fillTables() {
    for (const product of products) {
        await dynamoDb.put({
            TableName: productsTable,
            Item: product,
        }).promise();
    }

    for (const stock of stocks) {
        await dynamoDb.put({
            TableName: stocksTable,
            Item: stock,
        }).promise();
    }

    console.log('Filled tables');
}

fillTables().catch(console.error);
