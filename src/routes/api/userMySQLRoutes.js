const express = require('express')
const router = new express.Router()

const userMySQLController = require('../../controllers/userMySQLController')

router.get('/', userMySQLController.getUsers)
router.get('/:id', userMySQLController.getUser)
router.post('/', userMySQLController.addUser)
router.put('/:id', userMySQLController.updateUser)
router.delete('/:id', userMySQLController.deleteUser)

module.exports = router
