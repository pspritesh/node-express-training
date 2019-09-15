const express = require('express')
const router = new express.Router()

const apiRoutes = require('./apiRoutes')
const webRoutes = require('./webRoutes')
const auth = require('../middlewares/auth')

router.use('/api', auth.custom, apiRoutes)
router.use('/', webRoutes)

module.exports = router
