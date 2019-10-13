const bodyParser = require('body-parser')
// const csrf = require('csurf')
const express = require('express')
// const flash = require('connect-flash')
const mongoose = require('mongoose')
const multer = require('multer')
const path = require('path')
// const session = require('express-session')
require('dotenv').config()

const app = express()
// const csrfProtection = csrf()

/* Custom modules */
const mongoConnect = require('./src/config/dbconfig/MongoDB').mongoConnect
const routes = require('./src/routes/routes')
const sequelize = require('./src/config/dbconfig/SequelizeDB')
const sequelizeRelations = require('./src/helpers/sequelizeRelationshipHelper')
/* Custom modules */

// Best practices app settings
app.set('title', process.env.APP_NAME)
app.set('query parser', `extended`)

// Define the path where views are stored
app.set('views', path.join(__dirname, './src/views'))
// Define templating engine for app
app.set("view engine", "pug")

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", 'clientUrl')
  res.header("Access-Control-Allow-Headers", "Origin, Authorization, X-Requested-With, Content-Type, Accept")
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, HEAD, PUT, DELETE")
  if ('OPTIONS' === req.method) {
    res.sendStatus(200)
  } else {
    next()
  }
})

// Form encryption application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

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

// Express Session
// app.use(session({
//   secret: 'secret',
//   resave: false,
//   saveUninitialized: false
// }))

/* CSRF Configuration */
// Enables CSRF protection for forms
// app.use(csrfProtection)

// Pass CSRF field value to each Views globally so that it can be used in forms
// app.use((req, res, next) => res.locals.csrfToken = req.csrfToken())
/* CSRF Configuration */

// To use flash messages in our project
// app.use(flash())

// Handles routes in the app
app.use(routes)

/* eslint-disable no-unused-vars */
// error handler
app.use((err, req, res, next) => res.status(err.status || 500).json(err.message || 'Internal Server Error'))
/* eslint-enable no-unused-vars */

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
