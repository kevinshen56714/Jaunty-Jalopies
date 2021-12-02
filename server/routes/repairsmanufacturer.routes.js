const express = require('express')
const router = express.Router()
const repairsmanufacturercontroller = require('../controllers/repairsmanufacturer.controller.js')

router.get('/allmfr', repairsmanufacturercontroller.repairsByManufacturer);
router.get('/drilldownmfr/', repairsmanufacturercontroller.drillDownRepairsByManufacturer);

module.exports = router;
