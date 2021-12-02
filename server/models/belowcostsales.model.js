const db = require('../_helpers/db')

class BelowCostSales {
    static findAll() {
        const sql = `
        SELECT
        s.purchasedate AS PurchaseDate,
        v.invoiceprice AS InvoicePrice,
        s.soldprice AS SoldPrice,
        FORMAT(s.soldprice/v.invoiceprice * 100, 2) AS Percentage,
        CONCAT(c.firstname, " ", c.lastname) AS CustomerName,
        CONCAT(s.spfirstname, " ", s.splastname) AS SalesPersonName
    FROM Sale s
    INNER JOIN Vehicle v
    ON s.vin = v.vin
    INNER JOIN Person p
    ON s.custid = p.custid
    INNER JOIN Customer c
    ON p.custid = c.custid
    WHERE s.soldprice  < v.invoiceprice
    UNION
    SELECT
        s.purchasedate AS PurchaseDate,
        v.invoiceprice AS InvoicePrice,
        s.soldprice AS SoldPrice,
        FORMAT(s.soldprice/v.invoiceprice * 100, 2) AS Percentage,
        b.businessname AS CustomerName,
        CONCAT(s.spfirstname, " ", s.splastname) AS SalesPersonName
    FROM Sale s
    INNER JOIN Vehicle v
    ON s.vin = v.vin
    INNER JOIN Business b
    ON s.custid = b.custid
    INNER JOIN Customer c
    ON b.custid = c.custid
    WHERE s.soldprice < v.invoiceprice
    ORDER BY PurchaseDate DESC, Percentage DESC;
        `
        return db.execute(sql)
    }
}

module.exports = BelowCostSales
