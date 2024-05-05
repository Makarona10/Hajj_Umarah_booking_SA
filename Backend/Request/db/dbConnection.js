const mysql = require("mysql2");
const connection = mysql.createPool({
  host: "request-DB",
  user: "root",
  password: "1234",
  database: "bus_booking",
  port: 3306,
}).promise();

connection.query(`CREATE TABLE IF NOT EXISTS appointment_requests (
  id int(11) NOT NULL,
  appointment_id int(11) NOT NULL,
  traveler_id int(11) NOT NULL,
  created_at datetime NOT NULL DEFAULT current_timestamp(),
  status enum('pending','accepted','declined') DEFAULT 'pending'
)`)
connection.query(`CREATE TABLE IF NOT EXISTS users (
  id int(11) NOT NULL,
  username int(11) NOT NULL
)`)

connection.query(`SHOW TABLES`).then((res) => console.log(res))



module.exports = connection;
