const path = require('path')

const AWS = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.S3_REGION
});

/**
 * Check File Type
 * @param file
 * @param cb
 * @return {*}
 */
const checkFileType = (file, cb) => {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  // Check mime
  const mimetype = filetypes.test(file.mimetype)
  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb('Error: Images Only!')
  }
}

exports.imgUploadToS3 = multer({
  'storage': multerS3({
    's3': s3,
    'acl': 'public-read',
    'cacheControl': 'max-age=31536000',
    'bucket': process.env.ASSET_BUCKET,
    'metadata': (req, file, cb) => {
      console.log('file.fieldname', file.fieldname)
      console.log('file.originalname', file.originalname)
      cb(null, {
        'fieldName': file.fieldname
      })
    },
    'key': function(req, file, cb) {
      cb(null, Date.now().toString() + file.originalname );
    }
  })
})
