const Sequelize = require('sequelize')

const sequelize = require('../../config/dbconfig2')

const UserRoles = sequelize.define('userProducts', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  }
});

module.exports = UserRoles