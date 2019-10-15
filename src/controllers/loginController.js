const bcrypt = require('bcrypt')

const MongooseUser = require('../models/Mongoose/User')
const SequelizeUser = require('../models/Sequelize/User')

exports.postLogin = async (req, res, next) => {
  try {
    const mongooseUsers = await MongooseUser.findOne({ username: req.body.username })
    const sequelizeUsers = await SequelizeUser.findAll({ where:{username: req.body.username }})
    let token = ''
    if (sequelizeUsers) {
      token = await bcrypt.compare(req.body.password, sequelizeUsers[0].password) ? sequelizeUsers[0].api_token : ''
    } else if (mongooseUsers) {
      token = await bcrypt.compare(req.body.password, mongooseUsers.password) ? mongooseUsers.apiToken : ''
    }
    if (token) {
      return res.json({ apikey: token })
    } else {
      return res.status(404).json('User not found!')
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json("Something went wrong!")
  }
}
