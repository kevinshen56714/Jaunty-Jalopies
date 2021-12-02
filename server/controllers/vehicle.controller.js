const Vehicle = require('../models/vehicle.model.js')

const addVehicle = (req, res, next) => {
    const vehicleQuery = Vehicle.addVehicle(req.body)
    vehicleQuery
        .then(() => {
            const otherQueries = []
            switch (req.body.vehicletype) {
                case 'Car':
                    otherQueries.push(Vehicle.addCar(req.body))
                    break
                case 'Convertible':
                    otherQueries.push(Vehicle.addConvertible(req.body))
                    break
                case 'Truck':
                    otherQueries.push(Vehicle.addTruck(req.body))
                    break
                case 'Suv':
                    otherQueries.push(Vehicle.addSuv(req.body))
                    break
                case 'Van':
                    otherQueries.push(Vehicle.addVan(req.body))
                    break
            }
            req.body.color.map((item, index) => {
                otherQueries.push(Vehicle.addVehicleColor(req.body.vin, item))
            })
            Promise.all(otherQueries)
                .then(() => {
                    res.status(200).json({ message: 'Vehicle successfully added!' })
                })
                .catch((err) => {
                    console.log(err)
                    next(err)
                })
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })
}

const findVehicleByVin = (req, res, next) => {
    const vin = req.params.vin
    Vehicle.findVehicleByVin(vin)
        .then((result) => {
            if (result[0].length == 0) {
                throw 'Entered VIN does not match any vehicle in our database.'
            }
            res.send(result[0])
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })
}

async function searchVehicle(req, res, next) {
    const { vin, keyword, modelyear, mfrname, color, vehicletype, invoiceprice, GreaterThan } =
        req.params
    try {
        const result = await Vehicle.searchVehicle(
            vin,
            keyword,
            modelyear,
            mfrname,
            color,
            vehicletype,
            invoiceprice,
            GreaterThan
        )
        res.send(result[0])
    } catch (err) {
        console.log(err)
        next(err)
    }
}

async function viewVehicleDetails(req, res, next) {
    const vin = req.params.vin
    try {
        var result = await Vehicle.getVehicleDetails(vin)
        res.send(result[0])
    } catch (err) {
        console.log(err)
        next(err)
    }
}

async function countVehicles(req, res, next) {
    try {
        var result = await Vehicle.countVehiclesForSale()
        res.send(result[0])
    } catch (err) {
        console.log(err)
        next(err)
    }
}

async function getUnsold(req, res, next) {
    try {
        var result = await Vehicle.countVehiclesForSale()
        res.send(result)
    } catch (err) {
        console.log(err)
        next(err)
    }
}

module.exports = {
    addVehicle,
    findVehicleByVin,
    viewVehicleDetails,
    getUnsold,
    searchVehicle,
    countVehicles,
}
