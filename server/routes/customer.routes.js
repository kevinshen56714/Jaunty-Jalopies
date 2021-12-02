const { Router } = require('express')
const customer = require('../controllers/customer.controller.js')

const router = Router()
const { lookupBusiness, lookupPerson, addPerson, addBusiness } = customer

// @route POST - /customer/lookupBusiness
router.route('/lookupBusiness').post(lookupBusiness)

// @route POST - /customer/lookupPerson
router.route('/lookupPerson').post(lookupPerson)

// @route POST - /customer/addPerson
router.route('/addPerson').post(addPerson)

// @route POST - /customer/lookupPerson
router.route('/addBusiness').post(addBusiness)

module.exports = router
