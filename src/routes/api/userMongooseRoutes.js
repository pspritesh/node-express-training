const express = require('express')
const router = new express.Router()

const userMongooseController = require('../../controllers/userMongooseController')

router.get('/products', userMongooseController.getAllProducts)
router.post('/products', userMongooseController.createProduct)
router.put('/products/:id', userMongooseController.updateProduct)
router.delete('/products/:id', userMongooseController.deleteProduct)

router.get('/products/:id/mtm', userMongooseController.getUserProducts)
router.post('/products/:id/mtm', userMongooseController.addNewProduct)
router.get('/products/:id/image', userMongooseController.getProductImage)
router.post('/products/:id/image', userMongooseController.addNewProductImage)
router.post('/products/:uid/:pid', userMongooseController.assignProduct)

router.get('/', userMongooseController.getUsers)
router.get('/:id', userMongooseController.getUser)
router.post('/', userMongooseController.addUser)
router.put('/:id', userMongooseController.updateUser)
router.delete('/:id', userMongooseController.deleteUser)

router.get('/:id/pdf', userMongooseController.generatePDF)

module.exports = router
