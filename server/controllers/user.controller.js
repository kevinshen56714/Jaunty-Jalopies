const Joi = require('joi')
const validateRequest = require('_middleware/validate-request')
const User = require('../models/user.model.js')

exports.authenticateSchema = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
    })
    validateRequest(req, next, schema)
}

exports.authenticate = (req, res, next) => {
    console.log(req.body)
    User.authenticate(req.body)
        .then(([rows]) => {
            const resultArray = JSON.parse(JSON.stringify(rows))
            if (rows.length == 0) {
                throw 'Username does not exist in database'
            } else if (req.body.password != resultArray[0].password) {
                throw 'Password is incorrect'
            }
            res.send(resultArray[0])
        })
        .catch((error) => {
            console.log(error)
            next(error)
        })
}
