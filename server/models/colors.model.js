const db = require('../_helpers/db')

class Colors {
    static findAll() {
        const sql = `
            SELECT * FROM Colors
        `
        return db.execute(sql)
    }
}

module.exports = Colors
