// const AWS = require('aws-sdk');
// const s3 = new AWS.S3({ region: 'eu-west-1' });
// const csvParser = require('csv-parser');

// const bucketName = 'bukethw5'; 

// exports.handler = async (event) => {
//     console.log('event', event);
//     console.log("Received event:", JSON.stringify(event, null, 2));

//     if (!event.Records || !Array.isArray(event.Records)) {
//         console.error("The event does not contain Records array");
//         return;
//     }

//     for (const record of event.Records) {
//         const originalKey = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
//         console.log(`Processing file: ${originalKey}`);

//         const params = {
//             Bucket: bucketName,
//             Key: originalKey,
//         };

//         console.log('s3.getObject(params)',s3.getObject(params));

//         const s3Stream = s3.getObject(params).createReadStream(`uploaded/${originalKey}`);
//         s3Stream.on('error', (err) => {
//             console.error("Error reading file from S3:", err);
//         });
        


//         console.log('s3Stream',s3Stream);

//         try {

//             s3Stream.pipe(csvParser())
//                 .on('error', function(err) {
//                     console.error("Ошибка при чтении файла из S3:", err);
//                 })
//                 .on('data', (data) => console.log('csvParser',data))
//                 .on('end', async () => {
//                     console.log(`Finished processing file: ${originalKey}`);
//                     await moveFile(bucketName, originalKey);
//                 });
//         } catch (error) {
//             console.error(`Error processing file ${originalKey}:`, error);
//             throw error;
//         }
//     }
// };

// async function moveFile(bucket, originalKey) {
//     const parsedKey = originalKey.replace('uploaded/', 'parsed/');
    
//     await s3.copyObject({
//         Bucket: bucket,
//         CopySource: `${bucket}/${originalKey}`,
//         Key: parsedKey,
//     }).promise();

//     await s3.deleteObject({
//         Bucket: bucket,
//         Key: originalKey,
//     }).promise();

//     console.log(`File was moved from ${originalKey} to ${parsedKey}`);
// }


////-------------////////
const AWS = require('aws-sdk');
const csvParser = require('csv-parser');
const { Readable } = require('stream');

const s3 = new AWS.S3({ region: 'eu-west-1' });
const bucketName = 'bukethw5';

exports.handler = async (event) => {
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
                .on('data', (data) => console.log('csvParser', data))
                .on('end', async () => {
                    console.log(`Finished processing file: ${originalKey}`);
                    // await moveFile(bucketName, originalKey);
                })
                .on('error', (error) => {
                    console.error("Error processing file:", error);
                });

        } catch (error) {
            console.error(`Error getting file ${originalKey} from S3:`, error);
        }


        await moveFile(bucketName, originalKey);


    }
};

async function moveFile(bucket, originalKey) {
    const parsedKey = originalKey.replace('uploaded/', 'parsed/');
    try {
        console.log(`Attempting to move file from ${originalKey} to ${parsedKey}...`);
        
        const copyResult = await s3.copyObject({
            Bucket: bucket,
            CopySource: `${bucket}/${originalKey}`,
            Key: parsedKey,
        }).promise();

        console.log(`File was copied from ${originalKey} to ${parsedKey}:`, copyResult);

        const deleteResult = await s3.deleteObject({
            Bucket: bucket,
            Key: originalKey,
        }).promise();

        console.log(`File was deleted from ${originalKey}:`, deleteResult);

        console.log(`File was moved from ${originalKey} to ${parsedKey}`);

    } catch (error) {
        console.error(`Error moving file from ${originalKey} to ${parsedKey}:`, error);
    }

}
