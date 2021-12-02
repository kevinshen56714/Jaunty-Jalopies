const express = require('express')
const router = express.Router()
const vehicleController = require('../controllers/vehicle.controller.js')

router.post('/addvehicle', vehicleController.addVehicle)
router.get('/count', vehicleController.countVehicles)
router.get('/unsold', vehicleController.getUnsold)
router.get('/vehicledetail/:vin', vehicleController.viewVehicleDetails)
router.get('/:vin', vehicleController.findVehicleByVin)
router.get(
    '/search/:vin/:keyword/:modelyear/:mfrname/:color/:vehicletype/:invoiceprice/:GreaterThan',
    vehicleController.searchVehicle
)

module.exports = router
