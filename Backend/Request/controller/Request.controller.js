const conn = require("../db/dbConnection");
const util = require("util");
const axios = require("axios")

async function getHajjInfoById(hajjId) {
    try {
        const response = await axios.get(`http://hajjs_service:5000/api/hajj/${hajjId}`);
        return response.data;
    }
    catch (error) {
        console.error('Error fetching hajj info:', error.response ? error.response.data : error.message);
        throw error;
    }
}


getHajjDetails(hajjId)
    .then(hajjDetails => {
        console.log('Retrieved Hajj Details:', hajjDetails);
        const hajjfrom = hajjDetails.from_where;
        console.log('Hajj From:', hajjfrom);
    })
    .catch(err => {
        console.error('Failed to retrieve Hajj Details:', err);
    });

    async function updateOmra (omraId, new_max_num_trav) {
        try {
            const response = await axios.put(`http://omras_service_container/omra/update/${omraId}`, { max_num_trav: new_max_num_trav });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    };
    

const create = async (req, res) => {
    getHajjInfoById("6638f65f33dea8002ac5b8a0")
        .then(hajjDetails => {
            console.log('Retrieved Hajj Details:', hajjDetails);
            const hajjfrom = hajjDetails.from_where;
            console.log('Hajj From:', hajjfrom);
        })
        .catch(err => {
            console.error('Failed to retrieve Hajj Details:', err);
        });
    // try {
            
    //     const { appointmentId} = req.params;
    //     const { userId, userEmail } = req; 
    //     const query = util.promisify(conn.query).bind(conn);
    //     const { token } = req.headers;
    //     const requset = {
    //         appointment_id: appointmentId,
    //         traveler_id: userId,
    //     };
    //     await query("insert into appointment_requests set ? ", requset);
    //     res.status(200).json({
    //         msg: "created successfully !",
    //     });
    // } catch (err) {
    //     res.status(500).json(err);
    // }
    res.send();
}

const list_all = async (req, res) => {
    const query = util.promisify(conn.query).bind(conn);
    const requests = await conn.query(
        "SELECT appointment_requests.id, users.email, appointments.from_where, appointments.to_where, appointments.day_and_time, appointments.id as appid FROM appointment_requests join appointments join users WHERE appointment_id=appointments.id and traveler_id=users.id;"
    );
    if (!requests[0]) {
        res.status(404).json({ ms: "appointment not found !" });
    }
    res.status(200).json(requests);
}

const accept_req = async (req, res) => {
    try {
        const query = util.promisify(conn.query).bind(conn);
        // UPDATE appointment_requests SET status=pending 
        await query(
            "UPDATE appointment_requests SET status=  'accepted' where id = ?",
            req.params.reqid
        );
        const number = await query(
            "SELECT number_of_traveler FROM appointments WHERE id=?",
            req.params.id
        );

        const num = number[0].number_of_traveler;
        const newNum = num + 1;
        console.log(number);
        await query(` UPDATE appointments SET number_of_traveler=${newNum}  WHERE id=?`, req.params.id);
        res.status(200).json({
            number
        });
    } catch (err) {
        res.status(500).json(err);
    }
}

const decline_req = async (req, res) => {
    try {
        const query = util.promisify(conn.query).bind(conn);
        // UPDATE appointment_requests SET status=pending 
        await query(
            "UPDATE appointment_requests SET status=  'declined' where id = ?",
            req.params.id
        );

        res.status(200).json({
            msg: "rejected successfully !",
        });
    } catch (err) {
        res.status(500).json(err);
    }
}

// const list_history = async (req, res) => { //user id
//     const query = util.promisify(conn.query).bind(conn);
//     const appointment = await query(
//         "SELECT   appointment_requests.status , appointments.name , appointments.image ,appointments.id , appointments.from_where, appointments.to_where,appointments.ticket_price, appointments.day_and_time  FROM appointment_requests join appointments WHERE appointment_requests.traveler_id= ? and appointment_requests.appointment_id=appointments.id",
//         req.params.id
//     );

//     if (!appointment) {
//         res.status(404).json({ ms: "appointment not found !" });
//     }
//     appointment.map((a) => {
//         a.image = "http://" + req.hostname + ":4000/" + a.image;

//     });
//     res.status(200).json(appointment);
// }

module.exports = {create, list_all, accept_req, decline_req}