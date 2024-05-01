const conn = require("../../db/dbConnection");
const util = require("util"); // helper
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { body, check } = require("express-validator");


const admin = async (req, res, next) => {
    const query = util.promisify(conn.query).bind(conn);
    const { token } = req.headers;
    const admin = await query("select * from users where token = ?", [token]);
    if (admin[0] && admin[0].type == "admin") {
        next();
    } else {
        res.status(403).json({
            msg: "you are not authorized to access this route !",
        });
    }
};

const reg_validation = [
    body("email").isEmail().withMessage("please enter a valid email!"),
    body("name").isString().withMessage("please enter a valid name").isLength({ min: 3, max: 20 })
    .withMessage("name should be between (3-20) character"),
    body("password").isLength({ min: 8, max: 12 }).withMessage("password should be between (8-12) character")
]

const create_validation = [
    check("name").notEmpty().withMessage("Name is required"),
    check("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Email is not valid"),
    check("password").notEmpty().withMessage("Password is required"),
    check("phone").notEmpty().withMessage("Phone number is required")
]

module.exports = { admin, reg_validation, create_validation}