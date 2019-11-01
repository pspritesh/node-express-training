const express = require('express')
const router = new express.Router()

const userSequelizeController = require('../../controllers/userSequelizeController')

router.get('/products', userSequelizeController.getAllProducts)
router.post('/products', userSequelizeController.createProduct)
router.put('/products/:id', userSequelizeController.updateProduct)
router.delete('/products/:id', userSequelizeController.deleteProduct)

router.get('/products/:id/mtm', userSequelizeController.getProduct)
router.post('/products/:id/mtm', userSequelizeController.addNewProduct)
router.get('/products/:id/image', userSequelizeController.getProductImage)
router.post('/products/:id/image', userSequelizeController.addNewProductImage)
router.post('/products/:uid/:pid', userSequelizeController.assignProduct)

router.get('/', userSequelizeController.getUsers)
router.get('/:id', userSequelizeController.getUser)
router.post('/', userSequelizeController.addUser)
router.put('/:id', userSequelizeController.updateUser)
router.delete('/:id', userSequelizeController.deleteUser)

router.get('/:id/pdf', userSequelizeController.generatePDF)

module.exports = router
