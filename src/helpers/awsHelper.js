const path = require('path')

const AWS = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.S3_REGION
});

exports.imgUploadToS3 = multer({
  'storage': multerS3({
    's3': s3,
    'acl': 'public-read',
    'cacheControl': 'max-age=31536000',
    'bucket': process.env.ASSET_BUCKET,
    'metadata': (req, file, cb) => {
      cb(null, {
        'fieldName': file.fieldname
      })
    },
    'key': (req, file, cb) => cb(null, Date.now().toString() + '-' + file.originalname)
  }),
  'fileFilter': (req, file, cb) => {
    console.log('file', file)
    if (file.mimetype === 'image/png' || file.mimetype == 'image/jpg' || file.mimetype === 'image/jpeg') {
      if (true) {
        cb(null, true)
      } else {
        cb(null, false)
      }
    } else {
      cb(null, false)
    }
  }
})
