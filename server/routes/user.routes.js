const { Router } = require('express')
const user = require('../controllers/user.controller.js')

const router = Router()
const { authenticateSchema, authenticate } = user

// @route POST - /user/authenticate
router.route('/authenticate').post(authenticateSchema, authenticate)

module.exports = router
