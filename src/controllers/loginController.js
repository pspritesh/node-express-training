const bcrypt = require('bcrypt')

const MongooseUser = require('../models/Mongoose/User')
const SequelizeUser = require('../models/Sequelize/User')

exports.postLogin = async (req, res, next) => {
  try {
    const mongooseUsers = await MongooseUser.find({ username: req.body.username })
    const sequelizeUsers = await SequelizeUser.findAll({ where:{username: req.body.username }})
    const token = await bcrypt.compare(req.body.password, mongooseUsers[0].password) 
      ? mongooseUsers.map(user => user.apiToken) 
      : (
        await bcrypt.compare(req.body.password, sequelizeUsers[0].password) 
        ? sequelizeUsers.map(user => user.apiToken) 
        : ''
      )
    // const token = await mongooseUsers.filter(async user => await bcrypt.compare(req.body.password, user.password)).map(user => user.apiToken)
    return res.status(token ? 200 : 404).json(token ? token[0] : 'User not found!')
  } catch (error) {
    console.error(error)
    return res.status(500).json("Something went wrong!")
  }
}
