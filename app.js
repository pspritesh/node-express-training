const express = require('express');
const path = require('path');
const mongoose = require('mongoose')
const app = express();
require('dotenv').config();

/* Custom modules */
const error404Controller = require('./src/controllers/error404Controller');
const routes = require('./src/routes/routes');
const sequelize = require('./src/config/dbconfig/SequelizeDB');
const mongoConnect = require('./src/config/dbconfig/MongoDB').mongoConnect
const sequelizeRelations = require('./src/helpers/sequelizeRelationshipHelper')
/* Custom modules */

// Best practices app settings
app.set('title', process.env.APP_NAME);
app.set('query parser', `extended`);

// Define the path where views are stored
app.set('views', path.join(__dirname, './src/views'));
// Define templating engine for app
app.set("view engine", "pug");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", 'clientUrl');
  res.header("Access-Control-Allow-Headers", "Origin, Authorization, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, HEAD, PUT, DELETE");
  if ('OPTIONS' === req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
});

// serve static files
app.use(express.static(path.join(__dirname, 'src/public')));

app.enable('etag'); // use strong etags
app.set('etag', 'strong');

// Handles routes in the app
app.use('/api', routes);

// Handles 404 requests
app.use(error404Controller.error404);

/* eslint-disable no-unused-vars */
// error handler
app.use(function(err, req, res, next) {
	res.status(err.status || 500).send(err.message || 'Internal Server Error');
});
/* eslint-enable no-unused-vars */

// Establishes all relations for Sequelize
sequelizeRelations.config()
// Sequelize auto-create missing tables using sync()
sequelize.sync()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Find the server at: ${process.env.APP_URL}`);
    });
  })
  .catch(err => console.log(err))

// Connect to MongoDB
mongoConnect(() => {
  // app.listen(process.env.PORT, () => {
  //   console.log(`Find the server at: ${process.env.APP_URL}`);
  // });
  console.log(`Connection has been established successfully with '${process.env.DB_NAME}' mongo database.`)
})

// Connect to Mongoose ODM
mongoose.connect(process.env.DB_URL+process.env.DB_NAME, { useNewUrlParser: true })
  .then(() => {
    // app.listen(process.env.PORT, () => {
    //   console.log(`Find the server at: ${process.env.APP_URL}`);
    // });
    console.log(`Connection has been established successfully using mongoose ODM with '${process.env.DB_NAME}' database.`)
  })
  .catch(err => console.log(err))
