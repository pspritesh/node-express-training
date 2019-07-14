const Sequelize = require('sequelize')
const sequelize = require('../utils/database2')

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  fname: {
    type: Sequelize.STRING,
    allowNull: false
  },
  mname: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lname: {
    type: Sequelize.STRING,
    allowNull: false
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = User