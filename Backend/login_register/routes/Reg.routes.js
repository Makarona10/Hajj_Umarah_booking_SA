const router = require("express").Router();
const { body } = require("express-validator");
const authController = require("../controllers/Reg.controllers");
const m_ware = require("../middleware/Reg.middlewares");
// File modules
const conn = require("../../db/dbConnection");

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
  m_ware.reg_validation,
  authController.register
);

router.put("/logout/:id", authController.logout);

//////////////////////////////////////////////

router.post("/create",
  m_ware.admin,
  m_ware.create_validation,
  authController.create_user
);

// UPDATE Appointment [ADMIN]
// router.put(
//   "/:id", // params
//   admin,
//   body("name")
//     .isString()
//     .withMessage("please enter a valid name")
//     // .isLength({ min: 10, max: 20 })
//     // .withMessage("name should be between (10-20) character")
//     ,
//   body("email")
//     .isEmail()
//     .withMessage("please enter a valid email")
//     .isLength({ min: 5 }),
//   body("phone")
//     .isMobilePhone()
//     .withMessage("please enter a valid number")
//     .isLength({ min: 5 }),

//   async (req, res) => {
//     try {
//       // 1- VALIDATION REQUEST [manual, express validation]
//       const query = util.promisify(conn.query).bind(conn);
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       }

//       // 2- CHECK IF traveler EXISTS OR NOT
//       const traveler = await query("select * from users where id = ?", [
//         req.params.id,
//       ]);
//       if (!traveler[0]) {
//         res.status(404).json({ ms: "traveler not found !" });
//         return;
//       }

//       // 3- PREPARE MOVIE OBJECT
//       const travelerObj = {
//         name: req.body.name,
//         email: req.body.email,
//         phone: req.body.phone,
//       };

//       // 4- UPDATE MOVIE
//       await query("update users set ? where id = ?", [
//         travelerObj,
//         traveler[0].id,
//       ]);

//       res.status(200).json({
//         msg: "traveler updated successfully",
//       });
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   }
// );

// DELETE APPOINTMENT [ADMIN]
// router.delete(
//   "/:id", // params
//   admin,
//   async (req, res) => {
//     try {
//       // 1- VALIDATION REQUEST [manual, express validation]
//       const query = util.promisify(conn.query).bind(conn);
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       }
//       // 2- CHECK IF Appointment EXISTS OR NOT
//       const traveler = await query("select * from users where id = ?", [
//         req.params.id,
//       ]);
//       if (!traveler[0]) {
//         res.status(404).json({ ms: "traveler not found !" });
//         return;
//       }

//       await query("delete from users where id = ?", [traveler[0].id]);
//       res.status(200).json({
//         msg: "Traveler deleted successfully",
//       });
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   }
// );

// // SHOW traveler [ADMIN, USER]
// router.get("/getone/:id", async (req, res) => {
//   const query = util.promisify(conn.query).bind(conn);
//   const traveler = await query("select * from users where id = ?", [
//     req.params.id,
//   ]);
//   if (!traveler[0]) {
//     res.status(404).json({ ms: "traveler not found !" });
//   }
//   res.status(200).json(traveler[0]);
// });

// //SHOW ALL
// router.get("/all", async (req, res) => {
//   const query = util.promisify(conn.query).bind(conn);
//   const traveler = await query("select * from users where type = 'traveler' ");
//   if (!traveler[0]) {
//     res.status(404).json({ ms: "traveler not found !" });
//   }
//   res.status(200).json(traveler);
// });

module.exports = router;