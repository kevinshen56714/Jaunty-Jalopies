const db = require('../_helpers/db')

class Sale {
    static addSale({ custID, vin, purchasedate, soldprice, spfirstname, splastname }) {
        const sql = `
            INSERT INTO sale(custID, vin, purchasedate, soldprice, spfirstname, splastname)
            VALUES ('${custID}', '${vin}', '${purchasedate}', '${soldprice}', '${spfirstname}', '${splastname}');
        `
        return db.execute(sql)
    }

    static findSale(vin) {
        const sql = `
            SELECT EXISTS(SELECT * FROM Sale WHERE vin ="${vin}") AS sold; 
        `
        return db.execute(sql)
    }

    static getInvoice(vin) {
        const sql = `
            SELECT ve.Vin, ve.InvoicePrice
            FROM Vehicle AS ve
            INNER JOIN Sale AS sa
            ON ve.vin = sa.vin
            WHERE ve.Vin = '${vin}';
            `
        return db.execute(sql)
    }

    static saleByColorForLast30DaysOneColorandMultiColor() {
        const sql = `
            # Sales by color for the last 30 days, starting from the last available sale date
            # Select all vehicle with a single color
            (SELECT Color AS VColor, SUM(Cnt) AS VCount FROM
            (SELECT co.color AS Color, COUNT(vc.vin) AS Cnt
            FROM Colors co
            LEFT JOIN VehicleColor vc
            ON co.color = vc.color
            LEFT JOIN Sale sa
            ON vc.vin = sa.vin
            WHERE
                sa.purchasedate >= ((SELECT MAX(purchasedate) FROM Sale) - INTERVAL 1 MONTH) AND sa.purchasedate IS NOT NULL
                    AND
                sa.vin NOT IN
                (SELECT sa.vin FROM Vehiclecolor vc
                INNER JOIN Sale sa
                ON vc.vin = sa.vin
                GROUP BY sa.vin
                HAVING COUNT(sa.vin) > 1)
            GROUP BY Color
            UNION
            SELECT co.color, 0 AS Cnt
            FROM Colors co) AS R
            GROUP BY VColor
            ORDER BY VColor ASC)
            UNION
            # Select multi-colored vehicles
            SELECT "Multiple", Cnt AS VCount
            FROM(
            SELECT co.color AS Color, COUNT(DISTINCT vc.vin) AS Cnt
            FROM Colors co
            LEFT JOIN VehicleColor vc
            ON co.color = vc.color
            LEFT JOIN Sale sa
            ON vc.vin = sa.vin
            WHERE
                sa.purchasedate >= ((SELECT MAX(purchasedate) FROM Sale) - INTERVAL 1 MONTH) AND sa.purchasedate IS NOT NULL
                    AND
                sa.vin IN
                (SELECT sa.vin FROM Vehiclecolor vc
                INNER JOIN Sale sa
                ON vc.vin = sa.vin
                GROUP BY sa.vin
                HAVING COUNT(sa.vin) > 1)) AS S
                ORDER BY VColor ASC;
        `
        return db.execute(sql)
    }

    static saleByColorForLastYearOneColorandMultiColor() {
        const sql = `
            (SELECT Color AS VColor, SUM(Cnt) AS VCount FROM
            (SELECT co.color AS Color, COUNT(vc.vin) AS Cnt
            FROM Colors co
            LEFT JOIN VehicleColor vc
            ON co.color = vc.color
            LEFT JOIN Sale sa
            ON vc.vin = sa.vin
            WHERE
                sa.purchasedate >= ((SELECT MAX(purchasedate) FROM Sale) - INTERVAL 1 YEAR) AND sa.purchasedate IS NOT NULL
                    AND
                sa.vin NOT IN
                (SELECT sa.vin FROM Vehiclecolor vc
                INNER JOIN Sale sa
                ON vc.vin = sa.vin
                GROUP BY sa.vin
                HAVING COUNT(sa.vin) > 1)
            GROUP BY Color
            UNION
            SELECT co.color, 0 AS Cnt
            FROM Colors co) AS R
            GROUP BY VColor
            ORDER BY VColor ASC)
            UNION
            # Select multi-colored vehicles
            SELECT "Multiple", Cnt AS VCount
            FROM(
            SELECT co.color AS Color, COUNT(DISTINCT vc.vin) AS Cnt
            FROM Colors co
            LEFT JOIN VehicleColor vc
            ON co.color = vc.color
            LEFT JOIN Sale sa
            ON vc.vin = sa.vin
            WHERE
                sa.purchasedate >= ((SELECT MAX(purchasedate) FROM Sale) - INTERVAL 1 YEAR) AND sa.purchasedate IS NOT NULL
                    AND
                sa.vin IN
                (SELECT sa.vin FROM Vehiclecolor vc
                INNER JOIN Sale sa
                ON vc.vin = sa.vin
                GROUP BY sa.vin
                HAVING COUNT(sa.vin) > 1)) AS S
                ORDER BY VColor ASC;
        `
        return db.execute(sql)
    }

    static saleByColorForAlltimeOneColorandMultiColor() {
        const sql = `
            (SELECT Color AS VColor, SUM(Cnt) AS VCount FROM
            (SELECT co.color AS Color, COUNT(vc.vin) AS Cnt
            FROM Colors co
            LEFT JOIN VehicleColor vc
            ON co.color = vc.color
            LEFT JOIN Sale sa
            ON vc.vin = sa.vin
            WHERE
                sa.purchasedate IS NOT NULL
                    AND
                sa.vin NOT IN
                (SELECT sa.vin FROM Vehiclecolor vc
                INNER JOIN Sale sa
                ON vc.vin = sa.vin
                GROUP BY sa.vin
                HAVING COUNT(sa.vin) > 1)
            GROUP BY Color
            UNION
            SELECT co.color, 0 AS Cnt
            FROM Colors co) AS R
            GROUP BY VColor
            ORDER BY VColor ASC)
            UNION
            # Select multi-colored vehicles
            SELECT "Multiple", Cnt AS VCount
            FROM(
            SELECT co.color AS Color, COUNT(DISTINCT vc.vin) AS Cnt
            FROM Colors co
            LEFT JOIN VehicleColor vc
            ON co.color = vc.color
            LEFT JOIN Sale sa
            ON vc.vin = sa.vin
            WHERE
                sa.purchasedate IS NOT NULL
                    AND
                sa.vin IN
                (SELECT sa.vin FROM Vehiclecolor vc
                INNER JOIN Sale sa
                ON vc.vin = sa.vin
                GROUP BY sa.vin
                HAVING COUNT(sa.vin) > 1)) AS S
                ORDER BY VColor ASC;
        `
        return db.execute(sql)
    }

    static salesByTypeMonth() {
        const sql = `
            SELECT v.vehicletype AS Types, IFNULL(COUNT(s.vin), 0) As Sales
            FROM Vehicle v
            LEFT JOIN Sale s
            ON v.vin=s.vin
            WHERE s.purchasedate >= ((SELECT MAX(purchasedate) FROM Sale) - INTERVAL 1 MONTH) OR s.purchasedate IS NULL
            GROUP BY v.vehicletype
            ORDER BY LOWER(Types) ASC;
        `
        return db.execute(sql)
    }

    static salesByTypeYear() {
        const sql = `
            SELECT v.vehicletype AS Types, IFNULL(COUNT(s.vin), 0) As Sales
            FROM Vehicle v
            LEFT JOIN Sale s
            ON v.vin=s.vin
            WHERE s.purchasedate >= ((SELECT MAX(purchasedate) FROM Sale) - INTERVAL 1 YEAR) OR s.purchasedate IS NULL
            GROUP BY v.vehicletype
            ORDER BY LOWER(Types) ASC;
        `
        return db.execute(sql)
    }

    static salesByTypeAlltime() {
        const sql = `
            SELECT v.vehicletype AS Types, IFNULL(COUNT(s.vin), 0) As Sales
            FROM Vehicle v
            LEFT JOIN Sale s
            ON v.vin=s.vin
            GROUP BY v.vehicletype
            ORDER BY LOWER(Types) ASC;
        `
        return db.execute(sql)
    }
    static salesByMfrMonth() {
        const sql = `
            SELECT v.mfrname AS Mfrs, IFNULL(COUNT(v.mfrname), 0) As Sales
            FROM Sale s
            LEFT JOIN Vehicle v
            ON v.vin=s.vin
            WHERE s.purchasedate >= ((SELECT MAX(purchasedate) FROM Sale) - INTERVAL 1 MONTH) 
            GROUP BY v.mfrname
            ORDER BY LOWER(Mfrs) ASC;
        `
        return db.execute(sql)
    }

    static salesByMfrYear() {
        const sql = `
            SELECT v.mfrname AS Mfrs, IFNULL(COUNT(v.mfrname), 0) As Sales
            FROM Sale s
            LEFT JOIN Vehicle v
            ON v.vin=s.vin
            WHERE s.purchasedate >= ((SELECT MAX(purchasedate) FROM Sale) - INTERVAL 1 YEAR) 
            GROUP BY v.mfrname
            ORDER BY LOWER(Mfrs) ASC;
        `
        return db.execute(sql)
    }

    static salesByMfrAlltime() {
        const sql = `
            SELECT v.mfrname AS Mfrs, IFNULL(COUNT(v.mfrname), 0) As Sales
            FROM Sale s
            LEFT JOIN Vehicle v
            ON v.vin=s.vin
            GROUP BY v.mfrname
            ORDER BY LOWER(Mfrs) ASC;
        `
        return db.execute(sql)
    }
    static saleGrossOfCustomers() {
        const sql = `
                SELECT
                #*
                C.custID,
                C.customername AS CustomerName,
                S.numsales AS NumSales,
                R.numrepairs AS NumRepairs,
                LEAST( COALESCE(MIN(FirstSaleDate), MIN(FirstRepairDate)), COALESCE(MIN(FirstRepairDate), MIN(FirstSaleDate)) ) AS FirstDate,
                GREATEST( COALESCE(MAX(LastSaleDate), MAX(LastRepairDate)), COALESCE(MAX(LastRepairDate), MAX(LastSaleDate)) ) AS MostRecentDate,
                SUM(S.totalsales + R.totallabor + P.partscost) AS TotalGrossIncome
            FROM
            (SELECT
                cu.custID, CONCAT(cu.firstname, " ", cu.lastname) AS CustomerName
            FROM Customer cu
            INNER JOIN Person pe
            ON cu.custID = pe.custID
            UNION
            SELECT
                cu.custID, bu.businessname AS CustomerName
            FROM Customer cu
            INNER JOIN Business bu
            ON cu.custID = bu.custID) AS C
            LEFT JOIN
            (SELECT
                cu.custID,
                COUNT(sa.vin) AS NumSales,
                MIN(sa.purchasedate) AS FirstSaleDate,
                MAX(sa.purchasedate) AS LastSaleDate,
                SUM(COALESCE(sa.soldprice, 0)) AS TotalSales
            FROM Customer cu
            LEFT JOIN Sale sa
            ON cu.custID = sa.custID
            GROUP BY cu.custID) AS S
            ON C.custID = S.custID
            LEFT JOIN
            (SELECT
                cu.custID,
                COUNT(DISTINCT re.vin, re.startdate) AS NumRepairs,
                MIN(re.startdate) AS FirstRepairDate,
                MAX(re.startdate) AS LastRepairDate,
                SUM(COALESCE(re.laborcharges, 0)) AS TotalLabor
            FROM Customer cu
            LEFT JOIN Repair re
            ON cu.custID = re.custID
            GROUP BY re.custID) AS R
            ON C.custID = R.custID
            LEFT JOIN
            (SELECT
                re.custID,
                SUM(COALESCE(pa.partprice, 0) * COALESCE(pa.quantity, 0)) AS PartsCost
            From Customer cu
            LEFT JOIN Repair re
            ON cu.custID = re.custID
            LEFT JOIN Part pa
            ON re.vin = pa.vin AND re.startdate = pa.startdate
            GROUP BY re.custID) AS P
            ON C.custID = P.custID
            GROUP BY C.custID
            ORDER BY TotalGrossIncome DESC, MostRecentDate DESC
            LIMIT 15;
        `
        return db.execute(sql)
    }

    static drillDownOfSelectedCustomerForSales(custID) {
        const sql = `
            SELECT
                s.purchasedate AS SaleDate,
                s.soldprice AS SoldPrice,
                s.vin AS VIN,
                v.mfrname AS Manufacturer,
                v.modelyear AS ModelYear,
                v.modelname AS ModelName,
                CONCAT(s.spfirstname, " ", splastname) AS SalesPersonName
            FROM Sale s
            INNER JOIN Vehicle v
            ON s.vin = v.vin
            WHERE s.custid = "${custID}" # replace "B1302071867" with {custID}
            ORDER BY SaleDate DESC, VIN ASC;
        `

        return db.execute(sql)
    }
    static drillDownOfSelectedCustomerForRepair(custID) {
        const sql = `
            SELECT
                re.startdate AS StartDate,
                COALESCE(re.completedate, NULL) AS CompleteDate,
                re.vin AS VIN,
                re.odometerreading AS Odometer,
                COALESCE(re.laborcharges, 0) AS LaborCharges,
                #COALESCE(pa.partprice,0) AS PartPrice,
                #COALESCE(pa.quantity,0) AS PartQuantity,
                COALESCE(pa.partprice,0) * COALESCE(pa.quantity,0) AS TotalPartsCost,
                COALESCE(re.laborcharges, 0) + COALESCE(pa.partprice,0) * COALESCE(pa.quantity,0) AS TotalCosts,
                CONCAT(swfirstname, " ", swlastname) AS ServiceWriterName
            FROM Repair re
            LEFT JOIN Part pa
            ON re.vin = pa.vin AND re.startdate = pa.startdate
            WHERE custID = "${custID}"
            GROUP BY re.vin, re.startdate
            ORDER BY CompleteDate IS NULL DESC, StartDate DESC, CompleteDate DESC, VIN ASC;
        `

        return db.execute(sql)
    }

    static getAdditionalBuyerContactInformation(vin) {
        const sql = `
            SELECT
                s.vin AS vin,
                s.custID as custID,
                CONCAT(c.firstname," ", c.lastname) AS CustomerName,
                c.address AS Address,
                c.city AS City,
                c.state AS State,
                c.zipcode AS Zip,
                c.phonenumber AS Phone,
                c.email AS Email,
                s.purchasedate AS SalesDate,
                ve.InvoicePrice * 1.25 AS
                ListPrice, 
                s.soldprice as SoldPrice,
                ve.InvoicePrice,
                CONCAT(spfirstname, " ", splastname) AS SpName
            FROM Sale s
            LEFT JOIN Customer c
            ON s.custID = c.custID 
            LEFT JOIN Business b
            ON s.custID = b.custID
            LEFT JOIN Vehicle ve
            ON ve.vin = s.vin
            WHERE s.VIN = "${vin}";
        `

        return db.execute(sql)
    }
}

module.exports = Sale
