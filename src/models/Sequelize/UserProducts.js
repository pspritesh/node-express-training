const Sequelize = require('sequelize')
const sequelizePaginate = require('sequelize-paginate')

const sequelize = require('../../config/dbconfig/SequelizeDB')

const userProducts = sequelize.define('userProducts', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  }
})

sequelizePaginate.paginate(userProducts)
module.exports = userProducts
