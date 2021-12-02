const db = require('../_helpers/db')

class MonthlySales {

    static create(req) {
        const {
            sale_year,
            sale_month
        } = req.body
    }

    static monthlysalesyearmonth() {
        const sql = `
        SELECT     YEAR(s.purchasedate) AS sale_year,
        MONTH(s.purchasedate) AS sale_month
        FROM Sale s
        `
        return db.execute(sql)
    }

    static monthlysales() {
        const sql = `
        SELECT
        YEAR(s.purchasedate) AS sale_year,
        MONTH(s.purchasedate) AS sale_month,
        COUNT(s.vin) AS TotalVehiclesSold,
        SUM(s.soldprice - v.invoiceprice) AS TotalSalesIncome,
        FORMAT(AVG(s.soldprice / v.invoiceprice) * 100, 0) AS Percentage      #in windows, remove AVG
    FROM Sale s
    INNER JOIN Vehicle v
    ON s.vin = v.vin
    GROUP BY sale_year, sale_month
    ORDER BY sale_year DESC, sale_month DESC;
        `
        return db.execute(sql)
    }

    static drilldownmonthlysalesmonthyear(sale_year, sale_month) {
        const sql = `
        SELECT
        CONCAT(s.spfirstname, " ", s.splastname) AS SalesPersonName,
        COUNT(DISTINCT(s.vin)) AS TotalVehiclesSold,
        SUM(s.soldprice) AS TotalSales
    FROM Sale s
    WHERE
        YEAR(s.purchasedate) = ${sale_year} # replace 2021 with {year}
        AND
        MONTH(s.purchasedate) = ${sale_month}  # replace 6 with {month}
    GROUP BY s.splastname
    ORDER BY TotalVehiclesSold DESC, TotalSales DESC;

    #in windows, group by s.splastname
        
        `
        return db.execute(sql)
        
    }

}

module.exports = MonthlySales