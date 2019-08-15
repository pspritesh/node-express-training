const Sequelize = require('sequelize')

const sequelize = require('../../config/dbconfig/SequelizeDB')

const UserRoles = sequelize.define('userProducts', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  }
})

module.exports = UserRoles