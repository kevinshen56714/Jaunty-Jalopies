const { Router } = require('express')
const colors = require('../controllers/colors.controller.js')

const router = Router()
const { findAll } = colors

// @route GET - /colors
router.route('/').get(findAll)

module.exports = router
