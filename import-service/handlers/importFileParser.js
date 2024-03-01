
const s3 = new AWS.S3({ region: 'eu-west-1' });
const AWS = require('aws-sdk');
const csvParser = require('csv-parser');
const bucketName = 'bukethw5'; 


exports.handler = async (event) => {
    for (const record of event.Records) {
        const originalKey = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
        const params = {
            Bucket: bucketName,
            Key: originalKey,
        };

        try {
            const s3Stream = s3.getObject(params).createReadStream();
            s3Stream.pipe(csvParser())
                .on('data', (data) => {
                    console.log(data);
                })
                .on('end', async () => {
                    await moveFile(bucketName, originalKey);
                });
        } catch (error) {
            console.error(`Ошибка при обработке файла ${originalKey}:`, error);
        }
    }
};

async function moveFile(bucket, originalKey) {
    const parsedKey = originalKey.replace('uploaded/', 'parsed/');
    
    await s3.copyObject({
        Bucket: bucket,
        CopySource: `${bucket}/${originalKey}`,
        Key: parsedKey,
    }).promise();

    await s3.deleteObject({
        Bucket: bucket,
        Key: originalKey,
    }).promise();

    console.log(`Файл был перемещен из ${originalKey} в ${parsedKey}`);
}

