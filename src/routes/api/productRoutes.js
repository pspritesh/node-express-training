const express = require('express')
const router = new express.Router()

const productsController = require('../../controllers/productsController')

router.get('/', productsController.getProducts)
router.get('/:id', productsController.getProduct)
router.post('/', productsController.addProduct)
router.put('/:id', productsController.updateProduct)
router.delete('/:id', productsController.deleteProduct)

module.exports = router
