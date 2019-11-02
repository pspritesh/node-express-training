const express = require('express')
const router = new express.Router()

const userMongooseController = require('../../controllers/userMongooseController')

router.route('/products')
  .get(userMongooseController.getAllProducts)
  .post(userMongooseController.createProduct)
router.route('/products/:productId')
  .put(userMongooseController.updateProduct)
  .delete(userMongooseController.deleteProduct)

router.route('/products/:userId/mtm')
  .get(userMongooseController.getUserProducts)
  .post(userMongooseController.addNewProduct)
router.route('/products/:productId/image')
  .get(userMongooseController.getProductImage)
  .post(userMongooseController.addNewProductImage)
router.post('/products/:userId/:productId', userMongooseController.assignProduct)

router.route('/')
  .get(userMongooseController.getUsers)
  .post(userMongooseController.addUser)
router.route('/:userId')
  .get(userMongooseController.getUser)
  .put(userMongooseController.updateUser)
  .delete(userMongooseController.deleteUser)

router.get('/:productId/pdf', userMongooseController.generatePDF)

module.exports = router
