const db = require('../_helpers/db')

class AveTimeInventory {
    static findAll() {
        const sql = `
        SELECT v.vehicletype AS Types, IFNULL(FORMAT(AVG(DATEDIFF(s.purchasedate, v.dateadded)+1), 0), "N/A") AS AvgTime
        FROM Vehicle v
        LEFT JOIN Sale s
        ON v.vin = s.vin
        GROUP BY v.vehicletype
        ORDER BY LOWER(Types) ASC;
        `
        return db.execute(sql)
    }
}

module.exports = AveTimeInventory
