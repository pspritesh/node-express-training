const express = require('express')
const router = new express.Router()

const adminRoutes = require('./adminRoutes')
const userRoutes = require('./userRoutes')
const productRoutes = require('./productRoutes')
const userMySQLRoutes = require('./userMySQLRoutes')
const userSequelizeRoutes = require('./userSequelizeRoutes')
const userMongoDBRoutes = require('./userMongoDBRoutes')

router.use('/admin', adminRoutes)
router.use('/products', productRoutes)
router.use('/usermysql', userMySQLRoutes)
router.use('/usersequelize', userSequelizeRoutes)
router.use('/usermongodb', userMongoDBRoutes)
router.use('/', userRoutes)

module.exports = router
