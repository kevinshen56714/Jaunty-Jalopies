const { Router } = require('express')
const avetimeinventory = require('../controllers/avetimeinventory.controller.js')

const router = Router()
const { findAll } = avetimeinventory

// @route GET - /avetimeinventory
router.route('/').get(findAll)

module.exports = router