const express = require('express')
const router = new express.Router()

const auth = require('../middlewares/auth')
const error404Controller = require('../controllers/error404Controller')
const loginController = require('../controllers/loginController')
const apiRoutes = require('./apiRoutes')
const webRoutes = require('./webRoutes')

router.post('/login', loginController.postLogin)
router.use('/api', auth.custom, apiRoutes)
router.use('/', webRoutes)

// Handles 404 requests
router.use(error404Controller.error404)

module.exports = router
