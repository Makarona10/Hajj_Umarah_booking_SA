const mysql = require("mysql2");
const connection = mysql.createPool({
  host: "request-DB",
  user: "root",
  password: "1234",
  database: "bus_booking",
  port: 3306,
}).promise();

connection.query(`CREATE TABLE IF NOT EXISTS test (
  id BIGINT PRIMARY KEY,
  name VARCHAR(50)
)`)

connection.query(`SHOW TABLES`).then((res) => console.log(res))



module.exports = connection;
