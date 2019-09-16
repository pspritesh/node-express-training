const express = require('express')
const router = new express.Router()

const auth = require('../middlewares/auth')
const loginController = require('../controllers/loginController')
const apiRoutes = require('./apiRoutes')
const webRoutes = require('./webRoutes')

router.post('/login', loginController.postLogin)
router.use('/api', auth.custom, apiRoutes)
router.use('/', webRoutes)

module.exports = router
