const AWS = require('aws-sdk');
const csvParser = require('csv-parser');
const { stat } = require('fs');
const { Readable } = require('stream');

const s3 = new AWS.S3({ region: 'eu-west-1' });
const sqs = new AWS.SQS({ region: 'eu-west-1' });
const bucketName = 'bukethw5';

exports.handler = async (event, context, callback) => {
    console.log("Received event:", JSON.stringify(event, null, 2));

    if (!event.Records || !Array.isArray(event.Records)) {
        console.error("The event does not contain Records array");
        return;
    }

    for (const record of event.Records) {
        const originalKey = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
        console.log(`Processing file: ${originalKey}`);

        const params = {
            Bucket: bucketName,
            Key: originalKey,
        };

        try {
            const { Body } = await s3.getObject(params).promise();

            const stream = new Readable();
            stream.push(Body);
            stream.push(null);

            stream.pipe(csvParser())
                .on('data', async (data) => {
                    try {
                        await sqs.sendMessage({
                            QueueUrl: process.env.SQS_URL,
                            MessageBody: JSON.stringify(data),
                        }).promise()
                        console.log('Message sent to SQS:', data);
                    } catch (error) {
                        console.error('Error sending message to SQS:', error);
                    }
                })
                .on('end', async () => {
                    console.log(`Finished processing file: ${originalKey}`);
                })
                .on('error', (error) => {
                    console.error("Error processing file:", error);
                });

        } catch (error) {
            console.error(`Error getting file ${originalKey} from S3:`, error);

            return { statusCode: 500, body: 'Internal server error' };
        }
        await moveFile(bucketName, originalKey);

        return { statusCode: 200, body: 'OK', headers: { 'Access-Control-Allow-Origin': '*' } };
    }
};

async function moveFile(bucket, originalKey) {
    const parsedKey = originalKey.replace('uploaded/', 'parsed/');
    try {
        console.log(`Attempting to move file from ${originalKey} to ${parsedKey}...`);

        await s3.copyObject({
            Bucket: bucket,
            CopySource: `${bucket}/${originalKey}`,
            Key: parsedKey,
        }).promise();

        console.log(`File was copied from ${originalKey} to ${parsedKey}`);

        await s3.deleteObject({
            Bucket: bucket,
            Key: originalKey,
        }).promise();

        console.log(`File was deleted from ${originalKey}`);

    } catch (error) {
        console.error(`Error moving file from ${originalKey} to ${parsedKey}:`, error);
    }
}

