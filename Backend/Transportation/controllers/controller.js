const db = require("../DB/connection")
const {validationResult} = require("express-validator")

// functions to abstract
const query_handler = async (sort, sign, u_construct) => {
    let seats = 0;

    switch (sort) {
        case "Ground":
            seats = 30
            break;
        case "AIR":
            seats = 80
            break;
        case "Nautical voy":
            seats = 130
            break;
        default:
            console.log("Wrong plan")
            return false;
          break;
      }
    const ret = await db.query(`UPDATE inventory
            SET avail_units = avail_units - ?
            , free_seats = free_seats - ? * ?
            WHERE Type = ?`, [u_construct, sign, seats, sort])
            .then(() => {return true})
            .catch(() => {return false})
    return ret;
}

const avail_unit_check = async (free_seats, ) => {

}


// API functions
const list_trans = async (req, res) => {
    try {
    const result = await db.query("SELECT * FROM inventory");
        res.status(200).send(result[0])
    } catch (error) {
        res.send(error)
    }
}
const reserve = async (req, res) => {
    const sort = req.body.sort
    try {
        let free = await db.query(`SELECT * FROM inventory WHERE Type = ?`, [sort])
        free = (free[0][0].free_seats)
        if (free > 0) {
            db.query(`UPDATE inventory
                    SET free_seats = free_seats - 1
                    WHERE Type = ?`, [sort]).then(result => {
                        return res.status(200).send({"msg": "Reserved successfully"});
                    }).catch(err => {
                        return res.send(err)
                    })
            if ((free%seats) === 0) {

            }
        }
        else {
            return res.status(200).send({"msg": "No Free Seats"});
        }
        
    } catch (err) {
        return res.send(err);
    }
}
const edit_avail = async (req, res) => {
    // When under construction is 1, avail decreases by 1 and when it's -1 
    // avail increases by 1
    const valres = validationResult(req)
    if (!valres.isEmpty()) {
        return res.status(400).send(valres);
    }
    const sort = req.body.sort, u_construct = req.body.u_construct;
    const sign = u_construct > 0 ? 1 : (u_construct < 0 ? -1 : 0);

    try {
        const ret = await query_handler (sort, sign, u_construct)
        if (ret === true) {
            return res.status(200).send({"msg": "Updated!"});
        } else {
            return res.status(400).send({"msg": "ERROR"})
        }
    } catch (err) {
        return res.status(400).send(err)
    }
}


module.exports = {list_trans, reserve, edit_avail}