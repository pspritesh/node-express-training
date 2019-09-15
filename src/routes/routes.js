const express = require('express')
const bcrypt = require('bcrypt')
const router = new express.Router()

const apiRoutes = require('./apiRoutes')
const webRoutes = require('./webRoutes')
const auth = require('../middlewares/auth')
const MongooseUser = require('../models/Mongoose/User')
const SequelizeUser = require('../models/Sequelize/User')

router.post('/login', async (req, res, next) => {
  try {
    const body = []
    req.on('data', chunk => {
      body.push(chunk)
    })
    req.on('end', async () => {
      const parsedBody = JSON.parse(Buffer.concat(body).toString())
      const mongooseUsers = await MongooseUser.find({ username: parsedBody.username })
      const sequelizeUsers = await SequelizeUser.findAll({ where:{username: parsedBody.username }})
      const token = await bcrypt.compare(parsedBody.password, mongooseUsers[0].password) 
        ? mongooseUsers.map(user => user.apiToken) 
        : (
          await bcrypt.compare(parsedBody.password, sequelizeUsers[0].password) 
          ? mongooseUsers.map(user => user.apiToken) 
          : ''
        )
      // const token = await mongooseUsers.filter(async user => await bcrypt.compare(parsedBody.password, user.password)).map(user => user.apiToken)
      return res.status(token ? 200 : 404).send(token ? token[0] : 'User not found!')
    })
  } catch (error) {
    console.error(error)
    return res.status(500).send("Something went wrong!")
  }
})
router.use('/api', auth.custom, apiRoutes)
router.use('/', webRoutes)

module.exports = router
