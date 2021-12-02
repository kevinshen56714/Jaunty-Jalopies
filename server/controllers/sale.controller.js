const Sale = require('../models/sale.model.js')

async function findSale(req, res) {
    const vin = req.params.vin
    var result = await Sale.findSale(vin)
    const Message = result[0]
    res.send(Message)
}

async function getInvoicePriceofVin(req, res) {
    const vin = req.params.vin
    var result = await Sale.getInvoice(vin)
    const price = result[0]
    res.send(price)
}

const addSale = (req, res, next) => {
    console.log(req.body)
    Sale.addSale(req.body)
        .then((result) => {
            res.send(result[0])
        })
        .catch((error) => {
            console.log(error)
            next(error)
        })
}

async function SalesByColor30Days(req, res) {
    var result = await Sale.saleByColorForLast30DaysOneColorandMultiColor()
    res.send(result[0])
}

async function SalesByColorOneYear(req, res) {
    var result = await Sale.saleByColorForLastYearOneColorandMultiColor()
    res.send(result[0])
}
async function SalesByColorAlltime(req, res) {
    var result = await Sale.saleByColorForAlltimeOneColorandMultiColor()
    res.send(result[0])
}

async function SalesByType30Days(req, res) {
    var result = await Sale.salesByTypeMonth()
    res.send(result[0])
}

async function SalesByTypeOneYear(req, res) {
    var result = await Sale.salesByTypeYear()
    res.send(result[0])
}
async function SalesByTypeAlltime(req, res) {
    var result = await Sale.salesByTypeAlltime()
    res.send(result[0])
}

async function SalesByMfr30Days(req, res) {
    var result = await Sale.salesByMfrMonth()
    res.send(result[0])
}

async function SalesByMfrOneYear(req, res) {
    var result = await Sale.salesByMfrYear()
    res.send(result[0])
}
async function SalesByMfrAlltime(req, res) {
    var result = await Sale.salesByMfrAlltime()
    res.send(result[0])
}

async function grossOfCustomers(req, res) {
    var result = await Sale.saleGrossOfCustomers()
    res.send(result[0])
}

async function saleGrossOfCustomer(req, res) {
    const custID = req.params.custID
    var result = await Sale.drillDownOfSelectedCustomerForSales(custID)
    res.send(result[0])
}
async function selectedRepair(req, res) {
    const custID = req.params.custID
    var result = await Sale.drillDownOfSelectedCustomerForRepair(custID)
    res.send(result[0])
}
async function getCusInfo(req, res) {
    const vin = req.params.vin
    var result = await Sale.getAdditionalBuyerContactInformation(vin)
    res.send(result[0])
}

module.exports = {
    addSale,
    findSale,
    getInvoicePriceofVin,
    SalesByColor30Days,
    SalesByColorOneYear,
    SalesByColorAlltime,
    SalesByType30Days,
    SalesByTypeOneYear,
    SalesByTypeAlltime,
    SalesByMfr30Days,
    SalesByMfrOneYear,
    SalesByMfrAlltime,
    grossOfCustomers,
    selectedRepair,
    saleGrossOfCustomer,
    getCusInfo,
}
