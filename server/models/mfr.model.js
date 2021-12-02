const db = require('../_helpers/db')

class Mfr {
    static findAll() {
        const sql = `
            SELECT * FROM Manufacturer
        `
        return db.execute(sql)
    }
}

module.exports = Mfr
