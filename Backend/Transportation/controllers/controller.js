const db = require("../DB/connection")
const {validationResult} = require("express-validator")

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
        if (sort === "AIR") {
            console.log("HEEY!")
            db.query(`UPDATE inventory
            SET avail_units = avail_units - ?
            , free_seats = free_seats - ? * 80
            WHERE Type = ?`, [u_construct, sign, sort]).then(result => {
                return res.status(200).send({"msg": "Updated!"});
            }).catch(err => {
                return res.status(400).send(err)
            })
        }
        else if (sort === "Ground") {
            db.query(`UPDATE inventory
            SET avail_units = avail_units - ?
            , free_seats = free_seats - ? * 30
            WHERE Type = ?`, [u_construct, sign, sort]).then(result => {
                return res.status(200).send({"msg": "Updated!"});
            }).catch(err => {
                return res.status(400).send(err)
            })
        }
        else if (sort === "Nautical voy") {
            db.query(`UPDATE inventory
            SET avail_units = avail_units - ?
            , free_seats = free_seats - ? * 130
            WHERE Type = ?`, [u_construct, sign, sort]).then(result => {
                return res.status(200).send({"msg": "Updated!"});
            }).catch(err => {
                return res.status(400).send(err)
            })
        } else {
            return res.status(400).send("Please enter a valid transportaion plan")
        }
    } catch (err) {
        return res.status(400).send(err)
    }
}


module.exports = {list_trans, reserve, edit_avail}