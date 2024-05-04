const evar = require('dotenv')
const sql = require('mysql2')
evar.config()

// console.log(process.env.HOST, process.env.DB_USER, process.env.DB_NAME)
const connect = sql.createPool({
    host: 'trans-DB',
    user: 'users',
    database: 'trans',
    port: 3306,
}).promise()


connect.query(`CREATE TABLE IF NOT EXISTS inventory (
    Type VARCHAR(20),
    units INT,
    avail_units INT,
    seats INT,
    free_seats INT,
)`).then(() => console.log("CREATED!!")).catch((error) => console.log(error));
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