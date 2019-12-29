const Sequelize = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');

const sequelize = require('../../config/dbconfig/SequelizeDB');

const Product = sequelize.define('product', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  image: {
    type: Sequelize.STRING,
    allowNull: true
  },
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false
  }
});

sequelizePaginate.paginate(Product);
module.exports = Product
