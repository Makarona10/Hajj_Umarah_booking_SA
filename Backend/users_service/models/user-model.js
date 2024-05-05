// const mongoose = require('mongoose')
// const Schema = mongoose.Schema

// const User = new Schema(
//     {
//         username: { type: String, required: true },
//         password: { type: String, required: true },
//         email: { type: String, required: true },
//         phone: { type: String, required: true },
//     },
//     { timestamps: true },
// )

// module.exports = mongoose.model('users', User)

const sql = require('mysql2');

const connect = sql.createPool({
    host: 'users-db',
    user: 'root',
    password: '1234',
    database: 'users',
    port: 3306,
}).promise()

connect.query(`CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    

)`)