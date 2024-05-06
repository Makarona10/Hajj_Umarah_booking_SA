const mysql = require("mysql2");
const connection = mysql.createPool({
  host: "request-DB",
  user: "root",
  password: "1234",
  database: "bus_booking",
  port: 3306,
}).promise();

connection.query(`CREATE TABLE appointment_requests (
  id int NOT NULL PRIMARY KEY,
  appointment_id int NOT NULL,
  traveler_id int NOT NULL,
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  type varchar(255) NOT NULL,
`)
connection.query(`CREATE TABLE IF NOT EXISTS users (
  id int(11) NOT NULL,
  username int(11) NOT NULL
)`)

connection.query(`SHOW TABLES`).then((res) => console.log(res)).catch((err) => console.log(err));



module.exports = connection;
