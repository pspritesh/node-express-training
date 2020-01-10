const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { responseObj } = require('../helpers/utilsHelper');
const MongooseUser = require('../models/Mongoose/User');
const SequelizeUser = require('../models/Sequelize/User');

exports.postLogin = async (req, res, next) => {
  try {
    const mongooseUsers = await MongooseUser.findOne({ username: req.body.username });
    const sequelizeUsers = await SequelizeUser.findAll({ where:{username: req.body.username }});
    let token = '';
    if (sequelizeUsers) {
      token = await bcrypt.compare(req.body.password, sequelizeUsers[0].password) ? sequelizeUsers[0].api_token : '';
    } else if (mongooseUsers) {
      token = await bcrypt.compare(req.body.password, mongooseUsers.password) ? mongooseUsers.apiToken : '';
    }
    if (token) {
      return res.json(responseObj(null, true, { 'token': token }));
    } else {
      return res.status(404).json(responseObj('User not found!'));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(responseObj('Something went wrong!'));
  }
}

exports.jwtLogin = async (req, res, next) => {
  try {
    const mongooseUsers = await MongooseUser.findOne({ username: req.body.username });
    const sequelizeUsers = await SequelizeUser.findAll({ where:{username: req.body.username }});
    let token = '';
    if (sequelizeUsers && sequelizeUsers[0] && await bcrypt.compare(req.body.password, sequelizeUsers[0].password)) {
      token = jwt.sign(
        {
          username: sequelizeUsers[0].username,
          userId: sequelizeUsers[0].id
        },
        process.env.APP_KEY,
        { expiresIn: '1h' }
      );
    } else if (mongooseUsers && await bcrypt.compare(req.body.password, mongooseUsers.password)) {
      token = jwt.sign(
        {
          username: mongooseUsers.username,
          userId: mongooseUsers._id.toString()
        },
        process.env.APP_KEY,
        { expiresIn: '1h' }
      );
    }
    if (token) {
      return res.json(responseObj(null, true, { 'token': token }));
    } else {
      return res.status(404).json(responseObj('User not found!'));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(responseObj('Something went wrong!'));
  }
}
