const express = require('express')
const router = new express.Router()

const userSequelizeController = require('../controllers/userSequelizeController')

router.get('/', userSequelizeController.getUsers)
router.get('/:id', userSequelizeController.getUser)
router.post('/', userSequelizeController.addUser)
router.put('/:id', userSequelizeController.updateUser)
router.delete('/:id', userSequelizeController.deleteUser)

router.get('/:id/mtm', userSequelizeController.getProduct)
router.post('/:id/mtm', userSequelizeController.addProduct)

module.exports = router
