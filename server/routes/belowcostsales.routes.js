const { Router } = require('express')
const belowcostsales = require('../controllers/belowcostsales.controller.js')

const router = Router()
const { findAll } = belowcostsales

// @route GET - /belowcostsales
router.route('/').get(findAll)

module.exports = router