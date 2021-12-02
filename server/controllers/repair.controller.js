const Repair = require('../models/repair.model.js')

const checkIfSoldForRepair = (req, res, next) => {
    Repair.checkIfSoldForRepair(req.params)
        .then(([rows]) => {
            const resultArray = JSON.parse(JSON.stringify(rows))
            if (rows.length == 0) {
                throw 'This vehicle has not been sold. You cannot repair an unsold vehicle.'
            }
            res.send(resultArray[0])
        })
        .catch((error) => {
            console.log(error)
            next(error)
        })
}

const findUnfinishedRepair = (req, res, next) => {
    Repair.findUnfinishedRepair(req.params)
        .then(([rows]) => {
            const resultArray = JSON.parse(JSON.stringify(rows))
            if (rows.length == 0) {
                throw 'There is no unfinished repair for this vehicle.'
            }
            res.send(resultArray[0])
        })
        .catch((error) => {
            console.log(error)
            next(error)
        })
}

const startNewRepair = (req, res, next) => {
    Repair.startNewRepair(req.body)
        .then((result) => {
            res.status(200).json({ message: 'New Repair Started!' })
        })
        .catch((error) => {
            console.log(error)
            next(error)
        })
}

const updateLaborCharges = (req, res, next) => {
    Repair.updateLaborCharges(req.body)
        .then((result) => {
            res.status(200).json({ message: 'Labor Charges Updated!' })
        })
        .catch((error) => {
            console.log(error)
            next(error)
        })
}

const completeRepair = (req, res, next) => {
    Repair.completeRepair(req.body)
        .then((result) => {
            res.status(200).json({ message: 'Repair is marked as completed!' })
        })
        .catch((error) => {
            console.log(error)
            next(error)
        })
}

const addParts = (req, res, next) => {
    Repair.addParts(req.body)
        .then((result) => {
            res.status(200).json({ message: 'Parts added!' })
        })
        .catch((error) => {
            console.log(error)
            next(error)
        })
}

const findRepair = (req, res, next) =>{
    const vin = req.params.vin
    Repair.lookupRepair(vin)
        .then((result) => {
            res.send(result[0])
        })
        .catch((error) => {
            console.log(error)
            next(error)
        })
}


module.exports = {
    checkIfSoldForRepair,
    findUnfinishedRepair,
    startNewRepair,
    updateLaborCharges,
    completeRepair,
    addParts,
    findRepair
}
