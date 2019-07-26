const express = require('express')
const router = new express.Router()

router.use('/', (req, res) => res.render("admin/admin", {title:"Admin", message:"Admin section!"}))

module.exports = router
