const { Router } = require('express')
const parts = require('../controllers/parts.controller.js')

const router = Router()
const { findAll } = parts

// @route GET - /colors
router.route('/').get(findAll)


module.exports = router
