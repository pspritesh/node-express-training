const express = require('express')
const router = new express.Router()

const auth = require('../middlewares/auth')
const productRoutes = require('./api/productRoutes')
const userMongoDBRoutes = require('./api/userMongoDBRoutes')
const userMongooseRoutes = require('./api/userMongooseRoutes')
const userMySQLRoutes = require('./api/userMySQLRoutes')
const userSequelizeRoutes = require('./api/userSequelizeRoutes')

router.use('/products', productRoutes)
router.use('/usermysql', auth.sqlAuthorize, userMySQLRoutes)
router.use('/usersequelize', auth.sqlAuthorize, userSequelizeRoutes)
router.use('/usermongodb', auth.mongoAuthorize, userMongoDBRoutes)
router.use('/usermongoose', auth.mongoAuthorize, userMongooseRoutes)

module.exports = router
