const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS({ region: 'eu-west-1' });

// PRODUCTS_TABLE	products
// STOCKS_TABLE	stocks

exports.catalogBatchProcess = async (event) => {
  console.log('Event: ', event);
  const products = event.Records.map(({ body }) => JSON.parse(body));

  products.forEach(async (product) => {
    const params = {
      TableName: 'products',
      Item: {
        title: product.title,
        price: product.price,
        description: product.description,
        count: product.count
      },
    };

    try {
      await dynamoDb.put(params).promise();
      console.log(`Product created: ${product.title}`);
      const snsMessage = {
        Subject: 'New Product Created',
        Message: `A new product was created: ${product.title}`,
        TopicArn: process.env.SNS_TOPIC_ARN,
      };

      await sns.publish(snsMessage).promise();
      console.log('SNS message sent successfully');

    } catch (error) {
      console.error(`Error creating product ${product.title}:`, error);
    }
  });
};

module.exports = {catalogBatchProcess}
