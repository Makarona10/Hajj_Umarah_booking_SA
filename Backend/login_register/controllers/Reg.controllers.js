const { validationResult } = require("express-validator");
const conn = require("../../db/dbConnection");
const util = require("util");
const bcrypt = require("bcrypt");
const { register } = require("module");
const crypto = require("crypto");


const postLogin = async (req, res) => {
    try {
        // TODO
        // Get login credentials and store them in variables

        // 1- VALIDATION REQUEST [manual, express validation]
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const query = util.promisify(conn.query).bind(conn); // transform query mysql --> promise to use [await/async]
        const user = await query("select * from users where email = ?", [
            req.body.email,
        ]);
        // await query("UPDATE users SET status ='active' WHERE id = 1");
        const id = user[0].id;
        await query("UPDATE users SET status ='active' WHERE id = ?", id);
        if (!user) {
            res.status(404).json({
                errors: [
                    {
                        msg: "email or password not found !",
                    },
                ],
            });
        }

        const checkPassword = await bcrypt.compare(
            req.body.password,
            user[0].password
        );
        if (checkPassword) {
            // 3- REMOVE PASSWORD FIELD FROM USER OBJECT BEFORE SENDING AS RESPONSE
            delete user[0].password;
            console.log(user.token);
            // 4- SEND RESPONSE WITH USER OBJECT
            res.status(200).json(user[0]);
        } else {
            res.status(404).json({
                errors: [
                    {
                        msg: "email or password not found !",
                    },
                ],
            });
        }
    } catch (err) {
        res.status(500).json({
            err: err,
        });
    }
};

const register = async (req, res) => {
    try {
        // 1- VALIDATION REQUEST [manual, express validation]
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // 2- CHECK IF EMAIL EXISTS
        const query = util.promisify(conn.query).bind(conn); // transform query mysql --> promise to use [await/async]
        const checkEmailExists = await query(
            "select * from users where email = ?",
            [req.body.email]
        );
        if (checkEmailExists.length > 0) {
            res.status(400).json({
                errors: [
                    {
                        msg: "email already exists !",
                    },
                ],
            });
        }

        // 3- PREPARE OBJECT USER TO -> SAVE
        const userData = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: await bcrypt.hash(req.body.password, 10),
            token: crypto.randomBytes(16).toString("hex"), // JSON WEB TOKEN, CRYPTO -> RANDOM ENCRYPTION STANDARD
        };

        // 4- INSERT USER OBJECT INTO DB
        await query("insert into users set ? ", userData);
        delete userData.password;
        res.status(200).json(userData);
    } catch (err) {
        res.status(500).json({ err: err });
    }
}

const logout = async (req, res) => {
    const query = util.promisify(conn.query).bind(conn);
    await query(
        "UPDATE users SET status ='inactive' WHERE id = ?",
        req.params.id
    );
    res.status(200).json({
        msg: "logout successfully !",
    });
}

// Hash password function
const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

// Generate token function
const generateToken = () => {
    return crypto.randomBytes(20).toString("hex");
};

const create_user = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone } = req.body;
    const hashedPassword = authController.hashPassword(password);
    const token = authController.generateToken;

    const user = {
        name,
        email,
        password: hashedPassword,
        phone,
        token,
    };

    conn.query("INSERT INTO users SET ?", user, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({ message: "User created successfully" });
        }
    });
}


module.exports = { postLogin, register, logout, hashPassword, generateToken, create_user }