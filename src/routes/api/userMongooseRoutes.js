const express = require('express')
const router = new express.Router()

const userMongooseController = require('../../controllers/userMongooseController')

router.route('/products')
  .get(userMongooseController.getAllProducts)
  .post(userMongooseController.createProduct)
router.route('/products/:id')
  .put(userMongooseController.updateProduct)
  .delete(userMongooseController.deleteProduct)

router.route('/products/:id/mtm')
  .get(userMongooseController.getUserProducts)
  .post(userMongooseController.addNewProduct)
router.route('/products/:id/image')
  .get(userMongooseController.getProductImage)
  .post(userMongooseController.addNewProductImage)
router.post('/products/:uid/:pid', userMongooseController.assignProduct)

router.route('/')
  .get(userMongooseController.getUsers)
  .post(userMongooseController.addUser)
router.route('/:id')
  .get(userMongooseController.getUser)
  .put(userMongooseController.updateUser)
  .delete(userMongooseController.deleteUser)

router.get('/:id/pdf', userMongooseController.generatePDF)

module.exports = router
