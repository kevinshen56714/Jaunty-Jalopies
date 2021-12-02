const Mfr = require('../models/mfr.model.js')

exports.findAll = async (req, res, next) => {
    try {
        const [result, _] = await Mfr.findAll()

        //May need to process the result before sending it back to client
        res.status(200).json({ result: result })
    } catch (error) {
        console.log(error)
        next(error)
    }
}
