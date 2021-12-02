const config = require('config.json')
const mysql = require('mysql2')

const { host, port, user, password, database } = config.database

console.log('Creating connection pool...')
const pool = mysql.createPool({
    host,
    port,
    user,
    database,
    password,
})

module.exports = pool.promise()
