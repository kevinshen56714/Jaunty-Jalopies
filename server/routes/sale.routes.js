const express = require('express');
const router = express.Router();
const saleController = require('../controllers/sale.controller.js')



router.get('/findsale/:vin', saleController.findSale);
router.get('/addsale/:vin/:', saleController.addSale);
router.get('/getinvoice/:vin', saleController.getInvoicePriceofVin);
router.get('/getcusinfo/:vin', saleController.getCusInfo);
router.post('/addSale', saleController.addSale);

router.get('/salesbycolor/month', saleController.SalesByColor30Days);
router.get('/salesbycolor/year', saleController.SalesByColorOneYear);
router.get('/salesbycolor/alltime', saleController.SalesByColorAlltime);

router.get('/salesbytype/month', saleController.SalesByType30Days);
router.get('/salesbytype/year', saleController.SalesByTypeOneYear);
router.get('/salesbytype/alltime', saleController.SalesByTypeAlltime);

router.get('/salesbymfr/month', saleController.SalesByMfr30Days);
router.get('/salesbymfr/year', saleController.SalesByMfrOneYear);
router.get('/salesbymfr/alltime', saleController.SalesByMfrAlltime);

router.get('/salesbygross/allcust', saleController.grossOfCustomers);
router.get('/salesbygross/year/:custID', saleController.saleGrossOfCustomer);
router.get('/salesbygross/alltime/:custID', saleController.selectedRepair);

module.exports = router;
