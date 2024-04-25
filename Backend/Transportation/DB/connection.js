const evar = require('dotenv')
const sql = require('mysql2')
evar.config()

// console.log(process.env.HOST, process.env.DB_USER, process.env.DB_NAME)
const connect = sql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'trans'
}).promise()
// const connect = sql.createPool({
//     host: process.env.HOST,
//     user: process.env.DB_USER,
//     database: process.env.DB_NAME
// }).promise()


// const res = connect.query('DELETE FROM inventory LIMIT 1');
// const res = connect.query('INSERT INTO inventory (Type ,units, avail_units, seats, free_seats) VALUES ("Ground", 0, 0, 0, 0)');
// connect.query(`SELECT * FROM inventory`)
//   .then(res => {
//     console.log(res[0]);
//   })
//   .catch(error => {
//     console.error("Error:", error);
//   });
// connect.query("SELECT * FROM inventory")
//     .then(res => {
//         console.log(res)
//     })
//     .catch(err => {
//         console.error(err)
//     })
module.exports = connect;