const {body} = require("express-validator")

const body_valid =
    [
        body('sort')
            .notEmpty()
            .withMessage("Please select a travalling plan")
    ]

module.exports = {body_valid};