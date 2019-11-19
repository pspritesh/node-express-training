const fs = require('fs')

const AWS = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')

const S3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.S3_REGION
});

exports.uploadFileToS3 = async (file) => {
  const params = {
    Bucket: process.env.ASSET_BUCKET,
    Key: file.originalname.toString(),
    Body: file,
    ACL: 'public-read',
    ContentEncoding: 'base64',
    ContentType: file.mimetype
  }

  const {
    Key,
    Location
  } = await S3.upload(params).promise()

  return {
    Key,
    location: Location
  }
  S3
    .upload({
      ACL: 'public-read', 
      Body: fs.createReadStream(file.path),
      Key: destFileName.toString(),
      ContentType: 'application/octet-stream' // force download if it's accessed as a top location
    })
    .on('httpUploadProgress', function(evt) { console.log(evt); })
    .send(callback);
}
