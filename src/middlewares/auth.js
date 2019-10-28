const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const SequelizeUser = require('../models/Sequelize/User')

exports.custom = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1]
    let user = await SequelizeUser.findAll({ where: { api_token: token } })
    if (user.length) {
      next()
    } else {
      user = await mongoose.model('User').find({ apiToken: token })
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

exports.mongoAuthorize = async (req, res, next) => {
  if (req.userId) {
    try {
      const data = await mongoose.model('User').findById(req.userId)
      if (data) {
        next()
      } else {
        return res.status(401).json('You are not authorised to access this page!')
      }
    } catch (error) {
      console.error(error)
      return res.status(401).json('You are not authorised to access this page!')
    }
  } else {
    return res.status(401).json('You are not authorised to access this page!')
  }
}

exports.sqlAuthorize = async (req, res, next) => {
  if (req.userId) {
    try {
      const user = await SequelizeUser.findAll({ where: {id: parseInt(req.userId)} })
      if (user.length) {
        next()
      } else {
        return res.status(401).json('You are not authorised to access this page!')
      }
    } catch (error) {
      console.error(error)
      return res.status(401).json('You are not authorised to access this page!')
    }
  } else {
    return res.status(401).json('You are not authorised to access this page!')
  }
}
