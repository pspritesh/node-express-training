const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();

// Custom modules
const error404Controller = require('./src/controllers/error404Controller');
const routes = require('./src/routes/routes');
const sequelize = require('./src/config/dbconfig2');
const Product = require('./src/models/ProductSequelize');
const User = require('./src/models/UserSequelize');

// Best practices app settings
app.set('title', 'My 1st App');
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
app.use(routes);

// Handles 404 requests
app.use(error404Controller.error404);

/* eslint-disable no-unused-vars */
// error handler
app.use(function(err, req, res, next) {
	res.status(err.status || 500).send(err.message || 'Internal Server Error');
});
/* eslint-enable no-unused-vars */

// One-To-One relationship
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'})
User.hasMany(Product)

// creates tables using models which are defined using sequelize into database if they doesn't exist
sequelize.sync()
  .then(result => {
    app.listen(process.env.APP_PORT, () => {
      console.log(`Find the server at: http://localhost:${process.env.APP_PORT}/`); // eslint-disable-line no-console
    });
  })
  .catch(err => console.log(err))
