const express = require('express')
const router = new express.Router()

const apiRoutes = require('./apiRoutes')
const webRoutes = require('./webRoutes')

router.use('/api', apiRoutes)
router.use('/', webRoutes)

module.exports = router
