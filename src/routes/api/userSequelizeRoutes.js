const express = require('express')
const router = new express.Router()

const userSequelizeController = require('../../controllers/userSequelizeController')

router.route('/products')
  .get(userSequelizeController.getAllProducts)
  .post(userSequelizeController.createProduct)
router.route('/products/:id')
  .put(userSequelizeController.updateProduct)
  .delete(userSequelizeController.deleteProduct)

router.route('/products/:id/mtm')
  .get(userSequelizeController.getProduct)
  .post(userSequelizeController.addNewProduct)
router.route('/products/:id/image')
  .get(userSequelizeController.getProductImage)
  .post(userSequelizeController.addNewProductImage)
router.post('/products/:uid/:pid', userSequelizeController.assignProduct)

router.route('/')
  .get(userSequelizeController.getUsers)
  .post(userSequelizeController.addUser)
router.route('/:id')
  .get(userSequelizeController.getUser)
  .put(userSequelizeController.updateUser)
  .delete(userSequelizeController.deleteUser)

router.get('/:id/pdf', userSequelizeController.generatePDF)

module.exports = router
