const express = require('express')
const router = new express.Router()

const userMongoDBController = require('../controllers/userMongoDBController')

router.get('/', userMongoDBController.getUsers)
router.get('/:id', userMongoDBController.getUser)
router.post('/', userMongoDBController.addUser)
router.put('/:id', userMongoDBController.updateUser)
router.delete('/:id', userMongoDBController.deleteUser)

module.exports = router
