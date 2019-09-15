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
        return res.send('Not authenticated!')
      }
    }
  } else {
    return res.send('Not authenticated!')
  }
}
