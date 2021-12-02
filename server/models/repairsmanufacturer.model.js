const db = require('../_helpers/db')

class RepairsManufacturer {

    static create(req) {
        const {
            mfrname
        } = req.body
    }
    static repairsByManufacturer() {
        const sql = `

        # Part One
         SELECT
             ma.mfrname AS ManufacturerName,
             COUNT(re.startdate) AS RepairCount,
             SUM(COALESCE(re.laborcharges, 0)) AS TotalLaborCharges,
             SUM(COALESCE(pa.partprice, 0) * COALESCE(pa.quantity, 0)) AS TotalPartsCost,
             #SUM(COALESCE(pa.partprice * pa.quantity, 0)) AS TotalPartsCosts,
             SUM(COALESCE(re.laborcharges, 0)) + SUM(COALESCE(pa.partprice, 0) * COALESCE(pa.quantity, 0)) AS TotalRepairCosts
         FROM Manufacturer ma
         LEFT JOIN Vehicle ve
         ON ma.mfrname = ve.mfrname
         LEFT JOIN Repair re
         ON ve.vin = re.vin
         LEFT JOIN Part pa
         ON re.vin = pa.vin AND re.startdate = pa.startdate
         GROUP BY ManufacturerName
         ORDER BY ManufacturerName ASC;
        `
        return db.execute(sql)
    }

    static drillDownRepairsByManufacturer(mfrname) {
        const sql = `

         #Part Two: Drill down for each type and for each model
         # For each manufacturer that has repairs
        SELECT
	        IF(GROUPING(ve.vehicletype), "All Types", ve.vehicletype) AS Type,
            IF(GROUPING(ve.modelname), "All Models", ve.modelname) AS Model,
	         #ve.vehicletype AS VehicleType,
             #ve.modelname AS ModelName,
            COUNT(re.startdate) AS RepairCount,
            SUM(COALESCE(pa.partprice, 0) * COALESCE(pa.quantity, 0)) AS PartsCosts,
            SUM(COALESCE(re.laborcharges, 0)) AS LaborCosts,
            SUM(COALESCE(pa.partprice, 0) * COALESCE(pa.quantity, 0)) + SUM(COALESCE(re.laborcharges, 0)) AS TotalCosts
        FROM Vehicle ve
        LEFT JOIN Repair re
        ON ve.vin = re.vin
        LEFT JOIN Part pa
        ON re.vin = pa.vin AND re.startdate = pa.startdate
        WHERE ve.mfrname = "${mfrname}" # replace "Acura" with {manufacturer_name}
        GROUP BY vehicletype, modelname WITH ROLLUP
        HAVING RepairCount > 0
        ORDER BY vehicletype ASC, RepairCount DESC, modelname ASC;
    `
    return db.execute(sql)
    }


} 

module.exports = RepairsManufacturer
