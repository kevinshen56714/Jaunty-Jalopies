const db = require('../_helpers/db')

class Customer {
    static addCustomer(
        firstname,
        lastname,
        address,
        city,
        state,
        zipcode,
        phonenumber,
        email,
        custid
    ) {
        const sql = `
            INSERT INTO customer
            (custID, firstname, lastname, address, city, state, zipcode, phonenumber, email)
            VALUES
            ('${custid}', '${firstname}', '${lastname}', '${address}', '${city}', '${state}', '${zipcode}', '${phonenumber}', '${email}');
        `
        return db.execute(sql)
    }

    static addPerson({
        firstname,
        lastname,
        address,
        city,
        state,
        zipcode,
        phonenumber,
        email,
        dln,
    }) {
        return this.addCustomer(
            firstname,
            lastname,
            address,
            city,
            state,
            zipcode,
            phonenumber,
            email,
            dln
        )
            .then((res) => {
                const sql = `
                    INSERT INTO person
                    (custID)
                    VALUES ('${dln}');
                `
                return db.execute(sql)
            })
            .catch((err) => {
                throw err
            })
    }

    static addBusiness({
        firstname,
        lastname,
        address,
        city,
        state,
        zipcode,
        phonenumber,
        email,
        ein,
        bname,
        btitle,
    }) {
        return this.addCustomer(
            firstname,
            lastname,
            address,
            city,
            state,
            zipcode,
            phonenumber,
            email,
            ein
        )
            .then((res) => {
                const sql = `
                    INSERT INTO business
                    (custID, businessname, title)
                    VALUES ('${ein}', '${bname}', '${btitle}');
                `
                return db.execute(sql)
            })
            .catch((err) => {
                throw err
            })
    }

    static lookupBusiness({ ein }) {
        const sql = `
            SELECT c.custid, b.businessname, b.title, c.firstname, c.lastname, c.address, c.city, c.state, c.zipcode, c.phonenumber, c.email
            FROM Business b
		    INNER JOIN Customer c
            ON b.custid = c.custid
            WHERE c.custid = '${ein}';
        `
        return db.execute(sql)
    }

    static lookupPerson({ dln }) {
        const sql = `
            SELECT c.custid, c.firstname, c.lastname, c.address, c.city, c.state, c.zipcode, c.phonenumber, c.email
            FROM Person p
            INNER JOIN Customer c
            ON p.custid = c.custid
            WHERE p.custid = '${dln}';
        `
        return db.execute(sql)
    }
}

module.exports = Customer
