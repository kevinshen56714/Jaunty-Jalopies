const RepairsManufacturer = require('../models/repairsmanufacturer.model.js')
const Mfr = require('../models/mfr.model.js')

async function repairsByManufacturer(req, res) {
    var result = await RepairsManufacturer.repairsByManufacturer()
    res.send(result[0])
}

const drillDownRepairsByManufacturer = (req, res, next) => {
    const mfrListQuery = Mfr.findAll()
    mfrListQuery
        .then((mfrListResponse) => {
            const mfrList = mfrListResponse[0]
            const allMfrQueries = []
            const resultObject = {}
            mfrList.map((row) => {
                allMfrQueries.push(RepairsManufacturer.drillDownRepairsByManufacturer(row.mfrname))
            })
            Promise.all(allMfrQueries)
                .then((allMfrResponses) => {
                    allMfrResponses.map((mfrResponse, index) => {
                        const mfrname = mfrList[index].mfrname
                        resultObject[mfrname] = mfrResponse[0]
                    })
                    res.send(resultObject)
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

module.exports = {
    repairsByManufacturer,
    drillDownRepairsByManufacturer
}
