const Colors = require('../models/colors.model.js')

exports.findAll = async (req, res, next) => {
    try {
        const [result, _] = await Colors.findAll()

        res.status(200).json({ result: result })
    } catch (error) {
        console.log(error)
        next(error)
    }
}
