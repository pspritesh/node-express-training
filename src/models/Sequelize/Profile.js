const Sequelize = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');

const sequelize = require('../../config/dbconfig/SequelizeDB');

const Profile = sequelize.define('profile', {
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
  }
});

sequelizePaginate.paginate(Profile);
module.exports = Profile
