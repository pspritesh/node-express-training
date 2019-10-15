const jwt = require('jsonwebtoken')

const MongooseUser = require('../models/Mongoose/User')
const SequeliseUser = require('../models/Sequelize/User')

exports.custom = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1]
    let user = await SequeliseUser.findAll({ where: { api_token: token } })
    if (user.length) {
      next()
    } else {
      user = await MongooseUser.find({ apiToken: token })
      if (user.length) {
        next()
      } else {
        return res.status(401).json('Not authenticated!')
      }
    }
  } else {
    return res.status(401).json('Not authenticated!')
  }
}

exports.jwtAuth = (req, res, next) => {
  if (req.headers.authorization) {
    try {
      let decodedToken = jwt.verify(req.headers.authorization.split(" ")[1], process.env.APP_KEY)
      if (decodedToken) {
        req.userId = decodedToken.userId
        next()
      } else {
        return res.status(401).json('Not authenticated!')
      }
    } catch (error) {
      return res.status(401).json("Not authenticated!")
    }
  } else {
    return res.status(401).json('Not authenticated!')
  }
}
