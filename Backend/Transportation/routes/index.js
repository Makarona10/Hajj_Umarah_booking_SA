const controller = require("../controllers/controller")
const express = require("express")
const {body} = require("express-validator")
const {body_valid} = require("../middleware/middleware")
const app = express()
const route = express.Router()
app.use(express.json())

app.route('/')
    .get(controller.list_trans)
    .post(body_valid ,controller.reserve)

app.route('/api/modify')
    .patch(body_valid, controller.edit_avail)

app.use('/', route)

app.listen(4001, () => {
    console.log("Listening on port: 4001");
})
