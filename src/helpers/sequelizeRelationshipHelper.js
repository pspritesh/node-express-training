const Product = require('../models/Sequelize/Product')
const Profile = require('../models/Sequelize/Profile')
const User = require('../models/Sequelize/User')
const UserProducts = require('../models/Sequelize/UserProducts')

exports.config = () => {
  User.hasOne(Profile)
  Profile.belongsTo(User, {constraints: true, onDelete: 'CASCADE'})

  // Sequelize One-To-Many relationship
  // User.hasMany(Product)
  // Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'})

  // Sequelize Many-To-Many relationship
  User.belongsToMany(Product, {through: UserProducts, constraints: true, onDelete: 'CASCADE'})
  Product.belongsToMany(User, {through: UserProducts, constraints: true, onDelete: 'CASCADE'})
}
