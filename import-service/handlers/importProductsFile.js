// const AWS = require('aws-sdk');
// const BUCKET = 'bukethw5';

// const importProductsFile = async (event) => {
//   let thumbnails = [];
//   const s3 = new AWS.S3({ region: 'eu-west-1' });

//   const params = {
//     Bucket: BUCKET,
//     Prefix: 'uploaded/',
//   };
  
//   try {
//     const s3Response = await s3.listObjects(params).promise();
//     thumbnails = s3Response.Contents
//       .filter(thumbnail => thumbnail.Size > 0)
//       .map((thumbnail) => `<img src="https://${BUCKET}.s3.amazonaws.com/${thumbnail.Key}" style="max-width: 150px; margin: 10px;">`);
//   } catch (error) {
//     console.log('Error', error);
//     return {
//       statusCode: 500,
//       headers: { 'Content-Type': 'text/html' },
//       body: `<html><body><h1>Error fetching thumbnails</h1><p>${error}</p></body></html>`,
//     };
//   }

//   let htmlContent = `${thumbnails.join('')}`;

//   const response = {
//     statusCode: 200,
//     headers: {
//       'Content-Type': 'text/html',
//       'Access-Control-Allow-Origin': '*',
//     },
//     body: htmlContent,
//   };
  
//   return response;
// };

// exports.importProductsFile = importProductsFile;
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const bucketName = 'bukethw5';

exports.handler = async (event) => {
    const fileName = event.queryStringParameters ? event.queryStringParameters.name : null;

    const urls = [];

    if (!fileName) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing "name" query parameter' }),
        };
    }

    const params = {
        Bucket: bucketName,
        Key: `uploaded/${fileName}`,
        ContentType: 'text/csv',
    };

    console.log('Creating signed URL:', params);
    console.log('event', event);
    console.log('fileName', fileName);

    try {
        const signedUrl = await s3.getSignedUrlPromise('putObject', params);
        return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ uploadUrl: signedUrl }),
        };
    } catch (error) {
        console.error('Error creating signed URL:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error" }),
        };
    }

    // try {
    //     const signedUrl = await s3.listObjectsV2(params).promise();

    //     urls= signedUrl.Contents.map((url) => {
    //         return `https://${bucketName}.s3.amazonaws.com/${url.Key}`;
    //     });


    //     console.log('signedUrl', signedUrl);
    //     return {
    //         statusCode: 200,
    //         headers: { 'Access-Control-Allow-Origin': '*' },
    //         body: JSON.stringify(
    //             urls
    //         ),
    //     };
    // }
    // catch (error) {
    //     console.error('Error creating signed URL:', error);
    //     return {
    //         statusCode: 500,
    //         body: JSON.stringify({ message: "Internal server error" }),
    //     };
    // }



};



