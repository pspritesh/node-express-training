const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();

/* Custom modules */
const error404Controller = require('./src/controllers/error404Controller');
const routes = require('./src/routes/routes');

/* Sequelize imports */
const sequelize = require('./src/config/dbconfig/SequelizeDB');
const Product = require('./src/models/Sequelize/Product');
const Profile = require('./src/models/Sequelize/Profile');
const User = require('./src/models/Sequelize/User');
const UserProducts = require('./src/models/Sequelize/UserProducts');
/* Sequelize imports */

/* MongoDB imports */
const mongoConnect = require('./src/config/dbconfig/MongoDB').mongoConnect
/* MongoDB imports */
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

/* Sequelize relationships */
// Sequelize One-To-One relationship
User.hasOne(Profile)
Profile.belongsTo(User, {constraints: true, onDelete: 'CASCADE'})

// Sequelize One-To-Many relationship
// User.hasMany(Product)
// Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'})

// Sequelize Many-To-Many relationship
User.belongsToMany(Product, {through: UserProducts, constraints: true, onDelete: 'CASCADE'})
Product.belongsToMany(User, {through: UserProducts, constraints: true, onDelete: 'CASCADE'})

// Sequelize auto-create missing tables using sync()
sequelize.sync()
  .then(result => {
    app.listen(process.env.PORT, () => {
      console.log(`Find the server at: ${process.env.APP_URL}`);
    });
  })
  .catch(err => console.log(err))
/* Sequelize relationships */

// Connect to MongoDB
mongoConnect(() => {
  // app.listen(process.env.PORT, () => {
  //   console.log(`Find the server at: ${process.env.APP_URL}`);
  // });
})
