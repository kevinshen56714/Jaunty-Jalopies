const db = require('../_helpers/db')

class User {
    static authenticate({ username, password }) {
        const sql = `
            SELECT * FROM user WHERE username = '${username}'; 
        `
        return db.execute(sql)
    }
}

module.exports = User
