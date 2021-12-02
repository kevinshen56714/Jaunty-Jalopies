const db = require('../_helpers/db')

class Vehicle {
    static addVehicle({
        vin,
        mfrname,
        modelname,
        modelyear,
        vdescription,
        invoiceprice,
        icfirstname,
        iclastname,
        dateadded,
        vehicletype,
    }) {
        const sql = `
            INSERT INTO vehicle(
                vin, 
                mfrname, 
                dateadded, 
                modelname, 
                modelyear, 
                invoiceprice, 
                vdescription, 
                icfirstname, 
                iclastname, 
                vehicletype
            )
            VALUES(
                '${vin}',
                '${mfrname}',
                '${dateadded}',
                '${modelname}',
                '${modelyear}',
                '${invoiceprice}',
                '${vdescription}',
                '${icfirstname}',
                '${iclastname}',
                '${vehicletype}'
            );
        `
        return db.execute(sql)
    }

    static addSuv({ vin, numcupholder, drivetrain }) {
        const sql = `
            INSERT INTO suv(vin, numcupholder, drivetrain) 
            VALUES('${vin}', '${numcupholder}', '${drivetrain}');
        `
        return db.execute(sql)
    }

    static addTruck({ vin, cargocapacity, cargocovertype, numrearaxles }) {
        const sql = `
            INSERT INTO truck(vin, cargocapacity, cargocovertype, numrearaxles)
            VALUES('${vin}', '${cargocapacity}', '${cargocovertype}', '${numrearaxles}')
        `
        return db.execute(sql)
    }

    static addVan({ vin, driversidebackdoor }) {
        const sql = `
            INSERT INTO van(vin, driversidebackdoor)
            VALUES('${vin}', '${driversidebackdoor}')
        `
        return db.execute(sql)
    }

    static addConvertible({ vin, rooftype, backseatcount }) {
        const sql = `
            INSERT INTO convertible(vin, rooftype, backseatcount)
            VALUES('${vin}', '${rooftype}', '${backseatcount}')
        `
        return db.execute(sql)
    }

    static addCar({ vin, numdoors }) {
        const sql = `
            INSERT INTO car(vin, numdoors)
            VALUES('${vin}', '${numdoors}')
        `
        return db.execute(sql)
    }

    static addVehicleColor(vin, color) {
        const sql = `
            INSERT INTO VehicleColor (vin, color)
            VALUES('${vin}', '${color}');
        `
        return db.execute(sql)
    }

    static searchVehicle(
        vin,
        keyword,
        modelyear,
        mfrname,
        color,
        vehicletype,
        invoiceprice,
        GreaterThan
    ) {
        const sql = `
            SELECT
            ve.vin,
            ve.vehicletype,
            ve.modelyear,
            ve.mfrname,
            ve.modelname,
            GROUP_CONCAT(vc.color) AS color,
            FORMAT(ve.invoiceprice*1.25, 2) AS listprice,
            EXISTS(SELECT * FROM sale s WHERE s.vin = ve.vin) AS sold,
            CASE
                WHEN INSTR(ve.vdescription, '${keyword}') THEN 1 ELSE 0
            END AS matched_description
            FROM vehicle ve
            INNER JOIN vehiclecolor vc on ve.vin = vc.vin
            WHERE (ve.modelyear = '${modelyear}' OR ve.modelyear IS NULL OR '${modelyear}' = 'null')
            AND (ve.mfrname = '${mfrname}' OR ve.mfrname IS NULL OR '${mfrname}' = 'null')
            AND (ve.vin = '${vin}' OR ve.vin IS NULL OR '${vin}' = 'null')
            AND (ve.vehicletype = '${vehicletype}' OR ve.vehicletype IS NULL OR '${vehicletype}' = 'null')
            AND (vc.color = '${color}' OR vc.color IS NULL OR '${color}' = 'null')
            AND ('${invoiceprice}' = 'null' OR
            (CASE
                WHEN '${GreaterThan}' THEN ve.invoiceprice*1.25 > '${invoiceprice}'
                ELSE ve.invoiceprice*1.25 <= '${invoiceprice}'
            END))
            AND ((INSTR(ve.mfrname,'${keyword}')
                OR INSTR(ve.modelyear,'${keyword}')
                OR INSTR(ve.modelname,'${keyword}')
                OR INSTR(ve.vdescription,'${keyword}'))
                OR '${keyword}' = 'null')
            GROUP BY ve.vin
            ORDER BY ve.vin ASC;
        `
        return db.execute(sql)
    }

    static countVehiclesForSale() {
        const sql = `
            SELECT COUNT(ve.vin) AS TotalVehicleCountForSale
            FROM Vehicle ve
            WHERE ve.vin
            NOT IN (SELECT vin FROM Sale);
        `
        return db.execute(sql)
    }

    static findVehicleByVin(vin) {
        const sql = `
            SELECT * FROM vehiclecolor WHERE Vin = '${vin}';
        `
        return db.execute(sql)
    }

    static getVehicleDetails(vin) {
        const sql = `
            SELECT
            ve.vin,
            ve.vehicletype,
            ve.mfrname,
            ve.modelyear,
            ve.modelname,
            ve.invoiceprice,
            ve.icfirstname,
            ve.iclastname,
            ve.dateadded,
            FORMAT(ve.invoiceprice*1.25, 2) AS listprice,
            COALESCE(ve.vdescription, "Not Available") AS description,
            GROUP_CONCAT(vc.color) as 'colors',
            ca.numdoors,
            co.rooftype,
            co.backseatcount,
            tr.cargocapacity,
            tr.cargocovertype,
            tr.numrearaxles,
            va.driversidebackdoor,
            su.numcupholder,
            su.drivetrain
            FROM Vehicle ve
            LEFT OUTER JOIN Car ca
            ON ve.vin = ca.vin AND ve.vehicletype = "Car"
            LEFT OUTER JOIN Convertible co
            ON ve.vin = co.vin AND ve.vehicletype = "Convertible"
            LEFT OUTER JOIN Truck tr
            ON ve.vin = tr.vin AND ve.vehicletype = "Truck"
            LEFT OUTER JOIN Van va
            ON ve.vin = va.vin AND ve.vehicletype = "Van"
            LEFT OUTER JOIN Suv su
            ON ve.vin = su.vin AND ve.vehicletype = "Suv"
            LEFT JOIN Vehiclecolor vc
            ON ve.vin = vc.vin
            WHERE (ca.vin IS NOT NULL OR co.vin IS NOT NULL OR tr.vin IS NOT NULL OR va.vin IS NOT NULL OR su.vin IS NOT NULL)
            AND ve.vin = '${vin}'; 
        `
        return db.execute(sql)
    }
}

module.exports = Vehicle
