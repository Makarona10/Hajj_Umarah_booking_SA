const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const conn = require("../db/dbConnection");
const util = require("util");

const authController = require("./Reg.controllers");



// LOGIN
router.post(
  "/login",
  body("email").isEmail().withMessage("please enter a valid email!"),
  body("password")
    .isLength({ min: 8, max: 12 })
    .withMessage("password should be between (8-12) character"),
  authController.postLogin
);

///////////////////////////////////////////

// REGISTRATION
router.post(
  "/register",
  body("email").isEmail().withMessage("please enter a valid email!"),
  body("name")
    .isString()
    .withMessage("please enter a valid name")
    .isLength({ min: 3, max: 20 })
    .withMessage("name should be between (3-20) character"),
  body("password")
    .isLength({ min: 8, max: 12 })
    .withMessage("password should be between (8-12) character"),
  authController.register
);

router.put("/logout/:id", authController.logout);


module.exports = router;
