const express = require('express')
const router = new express.Router()

const userSequelizeController = require('../../controllers/userSequelizeController')

router.get('/', userSequelizeController.getUsers)
router.get('/:id', userSequelizeController.getUser)
router.post('/', userSequelizeController.addUser)
router.put('/:id', userSequelizeController.updateUser)
router.delete('/:id', userSequelizeController.deleteUser)

router.get('/:id/mtm', userSequelizeController.getProduct)
router.post('/:id/mtm', userSequelizeController.addNewProduct)
router.get('/:id/image', userSequelizeController.getProductImage)
router.post('/:id/image', userSequelizeController.addNewProductImage)
router.post('/:uid/:pid', userSequelizeController.assignProduct)

module.exports = router
