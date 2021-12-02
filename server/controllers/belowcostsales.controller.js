const BelowCostSales = require('../models/belowcostsales.model.js')

exports.findAll = async (req, res, next) => {
    try {
        const [result, _] = await BelowCostSales.findAll()

        res.status(200).json({ result: result })
    } catch (error) {
        console.log(error)
        next(error)
    }
}
