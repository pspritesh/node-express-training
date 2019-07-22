const express = require('express')
const router = new express.Router()

const myController = require('../controllers/myController')
const demoController = require('../controllers/demoController')
const productsController = require('../controllers/productsController')
const userMySQLController = require('../controllers/userMySQLController')
const userMongoDBController = require('../controllers/userMongoDBController')
const userSequelizeController = require('../controllers/userSequelizeController')

router.use('/demo', myController.index)
router.use('/pug-demo', demoController.my_demo)
router.use('/data-demo', demoController.index)
router.use('/write', demoController.write_file)

router.get('/products', productsController.getProducts)
router.get('/products/:id', productsController.getProduct)
router.post('/products', productsController.addProduct)
router.put('/products/:id', productsController.updateProduct)
router.delete('/products/:id', productsController.deleteProduct)

router.get('/usermysql', userMySQLController.getUsers)
router.get('/usermysql/:id', userMySQLController.getUser)
router.post('/usermysql', userMySQLController.addUser)
router.put('/usermysql/:id', userMySQLController.updateUser)
router.delete('/usermysql/:id', userMySQLController.deleteUser)

router.get('/usermongodb', userMongoDBController.getUsers)
router.get('/usermongodb/:id', userMongoDBController.getUser)
router.post('/usermongodb', userMongoDBController.addUser)
router.put('/usermongodb/:id', userMongoDBController.updateUser)
router.delete('/usermongodb/:id', userMongoDBController.deleteUser)

router.get('/usersequelize', userSequelizeController.getUsers)
router.get('/usersequelize/:id', userSequelizeController.getUser)
router.post('/usersequelize', userSequelizeController.addUser)
router.put('/usersequelize/:id', userSequelizeController.updateUser)
router.delete('/usersequelize/:id', userSequelizeController.deleteUser)

router.get('/usersequelize/:id/mtm', userSequelizeController.getProduct)
router.post('/usersequelize/:id/mtm', userSequelizeController.addProduct)

router.get('/', (req, res) => res.send("<h1>My 1st Express app.</h1>"))

module.exports = router