const express = require('express')
const router = new express.Router()

const myController = require('../../controllers/myController')
const demoController = require('../../controllers/demoController')

router.use('/demo', myController.index)
router.use('/pug-demo', demoController.my_demo)
router.use('/data-demo', demoController.index)
router.use('/write', demoController.write_file)

router.get('/', (req, res) => res.send("<h1>My 1st Express app.</h1>"))

module.exports = router
