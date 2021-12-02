const db = require('../_helpers/db')

class Parts {
    static findAll() {
        const sql = `
        SELECT vendorname, SUM(quantity) AS NumParts, 
        SUM(partprice*quantity)AS TotalSpent FROM part
        GROUP BY vendorname
        ORDER BY TotalSpent DESC
        
        `
        return db.execute(sql)
    }
}


module.exports = Parts
