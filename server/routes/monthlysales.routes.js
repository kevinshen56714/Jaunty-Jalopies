const express = require('express');
const router = express.Router();
const monthlySalesController = require('../controllers/monthlysales.controller.js')

router.get('/allmonths', monthlySalesController.monthlysales);
router.get('/drilldownmonthlysales/', monthlySalesController.drillDownMonthlySales);

module.exports = router