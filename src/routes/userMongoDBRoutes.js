const express = require('express')
const router = new express.Router()

const userMongoDBController = require('../controllers/userMongoDBController')

router.get('/', userMongoDBController.getUsers)
router.get('/:id', userMongoDBController.getUser)
router.post('/', userMongoDBController.addUser)
router.put('/:id', userMongoDBController.updateUser)
router.delete('/:id', userMongoDBController.deleteUser)

router.get('/:id/mtm', userMongoDBController.getProducts)
router.post('/:id/mtm', userMongoDBController.addNewProduct)
router.post('/:uid/:pid', userMongoDBController.assignProduct)

module.exports = router
