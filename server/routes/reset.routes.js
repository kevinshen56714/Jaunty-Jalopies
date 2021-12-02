const { Router } = require('express')
const resetController = require('../controllers/reset.controller.js')

const router = Router()
const { reset } = resetController

// @route POST - /reset
router.route('/').post(reset)

module.exports = router
