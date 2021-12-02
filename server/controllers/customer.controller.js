const Customer = require('../models/customer.model.js')

const addPerson = (req, res, next) => {
    console.log(req.body)
    Customer.addPerson(req.body)
        .then((result) => {
            res.send(result[0])
        })
        .catch((error) => {
            console.log(error)
            next(error)
        })
}

const addBusiness = (req, res, next) => {
    Customer.addBusiness(req.body)
        .then((result) => {
            res.send(result[0])
        })
        .catch((error) => {
            console.log(error)
            next(error)
        })
}
const lookupBusiness = (req, res, next) => {
    Customer.lookupBusiness(req.body)
        .then(([rows]) => {
            const resultArray = JSON.parse(JSON.stringify(rows))
            if (rows.length == 0) {
                throw 'Customer does not exist in database'
            }
            res.send(resultArray[0])
        })
        .catch((error) => {
            console.log(error)
            next(error)
        })
}
const lookupPerson = (req, res, next) => {
    Customer.lookupPerson(req.body)
        .then(([rows]) => {
            const resultArray = JSON.parse(JSON.stringify(rows))
            if (rows.length == 0) {
                throw 'Customer does not exist in database'
            }
            res.send(resultArray[0])
        })
        .catch((error) => {
            console.log(error)
            next(error)
        })
}

module.exports = {
    addPerson,
    addBusiness,
    lookupBusiness,
    lookupPerson,
}
