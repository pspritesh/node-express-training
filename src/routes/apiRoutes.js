const express = require('express')
const router = new express.Router()

const productRoutes = require('./api/productRoutes')
const userMySQLRoutes = require('./api/userMySQLRoutes')
const userSequelizeRoutes = require('./api/userSequelizeRoutes')
const userMongoDBRoutes = require('./api/userMongoDBRoutes')
const userMongooseRoutes = require('./api/userMongooseRoutes')

router.use('/products', productRoutes)
router.use('/usermysql', userMySQLRoutes)
router.use('/usersequelize', userSequelizeRoutes)
router.use('/usermongodb', userMongoDBRoutes)
router.use('/usermongoose', userMongooseRoutes)

module.exports = router
