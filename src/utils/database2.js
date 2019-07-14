const Sequelize = require('sequelize')
const sequelize = new Sequelize('nodeexpressdemo', 'root', 'root', {
  dialect: 'mysql',
  host: 'localhost'
})

module.exports = sequelize