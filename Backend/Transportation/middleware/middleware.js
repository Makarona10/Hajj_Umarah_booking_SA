const {body} = require("express-validator")

const body_valid =
    [
        body('sort')
            .notEmpty()
            .withMessage("Please select a travalling plan"),
        body('u_construct')
            .isInt()
    ]

module.exports = {body_valid};