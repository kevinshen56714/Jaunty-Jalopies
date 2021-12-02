const { Router } = require('express')
const repair = require('../controllers/repair.controller.js')

const router = Router()
const {
    checkIfSoldForRepair,
    findUnfinishedRepair,
    startNewRepair,
    updateLaborCharges,
    completeRepair,
    addParts,
    findRepair
} = repair

// @route GET - /repair/checkvehicle/:vin
router.route('/checkvehicle/:vin').get(checkIfSoldForRepair)

// @route GET - /repair/checkrepair/:vin/:custID
router.route('/checkrepair/:vin/:custID').get(findUnfinishedRepair)

// @route GET- /repair/findrepair/:vin
router.route('/findrepair/:vin').get(findRepair)

// @route POST - /repair/startnew
router.route('/startnew').post(startNewRepair)

// @route POST - /repair/updatelaborcharges
router.route('/updatelaborcharges').post(updateLaborCharges)

// @route POST - /repair/complete
router.route('/complete').post(completeRepair)

// @route POST - /repair/addparts
router.route('/addparts').post(addParts)



module.exports = router
