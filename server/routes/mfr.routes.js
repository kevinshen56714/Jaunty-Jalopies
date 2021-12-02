const { Router } = require('express')
const mfr = require('../controllers/mfr.controller.js')

const router = Router()
const { findAll } = mfr

// @route GET - /manufacturer
router.route('/').get(findAll)

module.exports = router
