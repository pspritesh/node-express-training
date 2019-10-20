const bodyParser = require('body-parser')
const compression = require('compression')
const express = require('express')
const helmet = require('helmet')
const mongoose = require('mongoose')
const morgan = require('morgan')
const multer = require('multer')
const path = require('path')
require('dotenv').config()

const app = express()

/**** Custom modules */
const mongoConnect = require('./src/config/dbconfig/MongoDB').mongoConnect
const routes = require('./src/routes/routes')
const sequelize = require('./src/config/dbconfig/SequelizeDB')
const sequelizeRelations = require('./src/helpers/sequelizeRelationshipHelper')
/**** Custom modules */

// Logging of each request using morgan
app.use(morgan('combined'))

// Set some special response headers using helmet
app.use(helmet())

// Compress the assets to be sent in response
app.use(compression())

// Best practices app settings
app.set('title', process.env.APP_NAME)
app.set('query parser', `extended`)

// Define the path where views are stored
app.set('views', path.join(__dirname, './src/views'))
// Define templating engine for app
app.set("view engine", "pug")

/**** Setting up the CORS for app */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL)
  res.header("Access-Control-Allow-Headers", "Origin, Authorization, X-Requested-With, Content-Type, Accept")
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD")
  if ('OPTIONS' === req.method) {
    res.sendStatus(200)
  } else {
    next()
  }
})
/**** Setting up the CORS for app */

// Form encryption application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// POST routes/APIs data in application/json format
app.use(bodyParser.json())

// Multer callback for storing files in proper naming convension
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'src/public/files/images'),
  filename: (req, file, cb) => cb(null, new Date().toISOString() + '-' + file.originalname)
})

// Multer callback for filtering file types
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype == 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

// Form encryption multipart/form-data
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'))

// serve static files
app.use(express.static(path.join(__dirname, 'src/public')))

app.enable('etag') // use strong etags
app.set('etag', 'strong')

// Handles routes in the app
app.use(routes)

/**** eslint-disable no-unused-vars */
// error handler
app.use((err, req, res, next) => res.status(err.status || 500).json(err.message || 'Internal Server Error'))
/**** eslint-enable no-unused-vars */

// Establishes all relations for Sequelize
sequelizeRelations.config()
// Sequelize auto-create missing tables using sync()
sequelize.sync()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Find the server at: ${process.env.APP_URL}`)
    })
  })
  .catch(err => console.error(err))

// Connect to MongoDB
mongoConnect(() => {
  // app.listen(process.env.PORT, () => {
  //   console.log(`Find the server at: ${process.env.APP_URL}`)
  // })
  console.log(`Connection has been established successfully with '${process.env.DB_NAME}' mongo database.`)
})

// Connect to Mongoose ODM
mongoose.connect(process.env.DB_URL+process.env.DB_NAME, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => {
    // app.listen(process.env.PORT, () => {
    //   console.log(`Find the server at: ${process.env.APP_URL}`)
    // })
    console.log(`Connection has been established successfully using mongoose ODM with '${process.env.DB_NAME}' database.`)
  })
  .catch(err => console.error(err))
