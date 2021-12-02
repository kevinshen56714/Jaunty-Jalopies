const Reset = require('../models/reset.model.js')

const reset = (req, res, next) => {
    Reset.reset()
        .then((result) => {
            res.status(200).json({ message: 'New Repair Started!' })
        })
        .catch((error) => {
            console.log(error)
            next(error)
        })
}

module.exports = {
    reset,
}
