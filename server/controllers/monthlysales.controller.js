const MonthlySales = require('../models/monthlysales.model.js')

async function monthlysales(req, res) {
    var result = await MonthlySales.monthlysales()
    res.send(result[0])
}

const drillDownMonthlySales = (req, res, next) => {
    const yearMonthListQuery = MonthlySales.monthlysalesyearmonth()
    yearMonthListQuery
        .then((yearMonthListResponse) => {
            const yearMonthList = yearMonthListResponse[0]
            const allyearMonthQueries = []
            const resultObject = {}
            yearMonthList.map((row) => {
                allyearMonthQueries.push(MonthlySales.drilldownmonthlysalesmonthyear(row.sale_year, row.sale_month))
            })
            Promise.all(allyearMonthQueries)
                .then((allyearMonthResponses) => {
                    allyearMonthResponses.map((yearMonthResponse, index) => {
                        const sale_year = yearMonthList[index].sale_year
                        const sale_month = yearMonthList[index].sale_month

                        resultObject[(sale_year, sale_month)] = yearMonthResponse[0]
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
    monthlysales,
    drillDownMonthlySales
}