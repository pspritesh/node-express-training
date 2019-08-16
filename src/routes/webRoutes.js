const express = require('express')
const router = new express.Router()

const adminRoutes = require('./web/adminRoutes')
const userRoutes = require('./web/userRoutes')

router.use('/admin', adminRoutes)
router.use('/', userRoutes)

module.exports = router
