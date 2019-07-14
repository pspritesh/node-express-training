const mysql = require('mysql2')
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'nodeexpressdemo',
  password: 'root'
})

module.exports = pool.promise()