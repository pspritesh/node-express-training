const express = require('express')
const router = new express.Router()

const userSequelizeController = require('../../controllers/userSequelizeController')

router.route('/products')
  .get(userSequelizeController.getAllProducts)
  .post(userSequelizeController.createProduct)

router.route('/products/:productId')
  .put(userSequelizeController.updateProduct)
  .delete(userSequelizeController.deleteProduct)


router.route('/products/:userId/mtm')
  .get(userSequelizeController.getProduct)
  .post(userSequelizeController.addNewProduct)

router.route('/products/:productId/image')
  .get(userSequelizeController.getProductImage)
  .post(userSequelizeController.addNewProductImage)
router.post('/products/:userId/:productId', userSequelizeController.assignProduct)


router.route('/')
  .get(userSequelizeController.getUsers)
  .post(userSequelizeController.addUser)

router.route('/:userId')
  .get(userSequelizeController.getUser)
  .put(userSequelizeController.updateUser)
  .delete(userSequelizeController.deleteUser)


router.get('/:productId/pdf', userSequelizeController.generatePDF)

module.exports = router
