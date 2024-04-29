const controller = require("../controllers/controller")
const express = require("express")
const morgan = require("morgan")
const {body_valid} = require("../middleware/middleware")
const app = express()
const route = express.Router()


app.use(express.json())
app.use(morgan('dev'))
app.use('/transport', route)

route.route('/')
    .get(controller.list_trans)
    .post(body_valid ,controller.reserve)

route.route('/modify/:sort')
    .patch(body_valid, controller.edit_avail)
    
route.route('/units')    
    .post(body_valid, controller.add_rem_units)


app.listen(4001, () => {
    console.log("Listening on port: 4001");
})

module.exports = route;
