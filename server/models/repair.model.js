const db = require('../_helpers/db')

class Repair {
    /**
     * Check if vehicle has been sold (cannot repair an unsold vehicle)
     * When vehicle is sold (present in Sale), returns all the appropriate
     * attributes, to be displayed on-screen, so the service writer can
     * verify they are viewing the correct vehicle
     */
    static checkIfSoldForRepair({ vin }) {
        const sql = `
            SELECT
            sa.vin,
            ve.vehicletype,
            ve.modelyear,
            ve.modelname,
            ve.mfrname,
            GROUP_CONCAT(DISTINCT vc.color) AS colors
            FROM sale sa
            INNER JOIN vehicle ve
            ON sa.vin = ve.vin
            INNER JOIN vehiclecolor vc
            ON sa.vin = vc.vin
            WHERE sa.vin = '${vin}'
            GROUP BY sa.vin;
        `
        return db.execute(sql)
    }

    static findUnfinishedRepair({ vin, custID }) {
        const sql = `
            SELECT 
            re.startdate,
            re.odometerreading,
            re.laborcharges,
            re.swfirstname,
            re.swlastname,
            re.rdescription,
            GROUP_CONCAT(p.partnumber) AS partnumbers,
            GROUP_CONCAT(p.partprice) AS partprices,
            GROUP_CONCAT(p.quantity) AS quantities,
            GROUP_CONCAT(p.vendorname) AS vendornames
            FROM repair re
            LEFT JOIN part p
            ON re.vin = p.vin AND re.startdate = p.startdate
            WHERE re.custID = '${custID}'
            AND re.vin = '${vin}'
            AND re.completedate IS NULL
            GROUP BY re.vin;
        `
        return db.execute(sql)
    }

    static startNewRepair({
        vin,
        custID,
        odometerreading,
        startdate,
        swfirstname,
        swlastname,
        rdescription,
    }) {
        const sql = `
            INSERT INTO repair(
                custid, 
                vin, 
                startdate, 
                completedate, 
                odometerreading, 
                laborcharges, 
                swfirstname, 
                swlastname, 
                rdescription
            )
            VALUES(
                '${custID}', 
                '${vin}', 
                '${startdate}',
                NULL, 
                '${odometerreading}', 
                NULL, 
                '${swfirstname}', 
                '${swlastname}', 
                '${rdescription}'
            );
        `
        return db.execute(sql)
    }

    static addParts({ vin, startdate, partnumber, partprice, quantity, vendorname }) {
        const sql = `
            INSERT INTO part (
                vin, 
                startdate, 
                partnumber, 
                partprice, 
                quantity, 
                vendorname
            )
        	VALUES (
                '${vin}', 
                '${startdate}', 
                '${partnumber}', 
                '${partprice}', 
                '${quantity}', 
                '${vendorname}'
            );

        `
        return db.execute(sql)
    }

    static updateLaborCharges({ vin, newLaborCharges }) {
        const sql = `
            UPDATE repair 
            SET laborcharges = ${newLaborCharges} + IFNULL(laborcharges, 0)
            WHERE vin='${vin}' AND completedate IS NULL;
        `
        return db.execute(sql)
    }

    static completeRepair({ vin, completedate }) {
        const sql = `
            UPDATE repair re
            SET re.completedate = '${completedate}'
            WHERE re.vin='${vin}' AND re.completedate IS NULL;
        `
        return db.execute(sql)
    }
    static lookupRepair(vin) {
        const sql = `
        SELECT
        re.startdate AS StartDate,
        COALESCE(re.completedate, NULL) AS CompleteDate,
        re.vin AS VIN,
        re.custID as custID,
        CONCAT(c.firstname," ", c.lastname) AS CustomerName,
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
    LEFT JOIN Customer c
  ON re.custID = c.custID
    WHERE re.VIN = '${vin}'
    GROUP BY re.vin, re.startdate
    ORDER BY CompleteDate IS NULL DESC, StartDate DESC, CompleteDate DESC, VIN ASC;`
        return db.execute(sql)
    }
}

module.exports = Repair
