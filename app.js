const csrf = require('csurf')
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const app = express()
require('dotenv').config()
const csrfProtection = csrf()

/* Custom modules */
const error404Controller = require('./src/controllers/error404Controller')
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

// serve static files
app.use(express.static(path.join(__dirname, 'src/public')))

app.enable('etag') // use strong etags
app.set('etag', 'strong')

// Handles routes in the app
app.use(routes)

// Enables CSRF protection for forms
app.use(csrfProtection)

// Pass CSRF field value to each Views globally so that it can be used in forms
app.use((req, res, next) => res.locals.csrfToken = req.csrfToken())

// Handles 404 requests
app.use(error404Controller.error404)

/* eslint-disable no-unused-vars */
// error handler
app.use((err, req, res, next) => res.status(err.status || 500).send(err.message || 'Internal Server Error'))
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
