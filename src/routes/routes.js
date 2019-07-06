const express = require('express')
const router = new express.Router()
const admin = require('./admin')
const user = require('./user')

router.use('/admin', admin)
router.use('/', user)

module.exports = router