const AveTimeInventory = require('../models/avetimeinventory.model.js')

exports.findAll = async (req, res, next) => {
    try {
        const [result, _] = await AveTimeInventory.findAll()

        res.status(200).json({ result: result })
    } catch (error) {
        console.log(error)
        next(error)
    }
}
