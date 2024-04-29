const router = require("express").Router();
const conn = require("../db/dbConnection");
const authorized = require("../middleware/authorize");
const admin = require("../middleware/admin");
const { body, validationResult } = require("express-validator");
const upload = require("../middleware/uploadImages");
const util = require("util"); // helper
const fs = require("fs"); // file system
const multer = require("multer");
//const upload = multer({ dest: 'uploads/' });
// CREATE Umrah [ADMIN]
router.post(
  "/create",
  upload.single("image"),
  body("name")
    .isString()
    .withMessage("Please enter a valid name")
    .isLength({ min: 5 }),
  body("from_where")
    .isString()
    .withMessage("Please enter a valid city name")
    .isLength({ min: 5 }),
  body("to_where")
    .isString()
    .withMessage("Please enter a valid city name")
    .isLength({ min: 5 }),
  body("ticket_price"),

  body("day_and_time").isLength({ min: 5 }),

  async (req, res) => {
    try {
      // 1- VALIDATION REQUEST [manual, express validation]
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (!req.file) {
        return res.status(400).json({
          errors: [
            {
              msg: "Image is required",
            },
          ],
        });
      }

      // 3- PREPARE Umrah OBJECT
      const umrah = {
        name: req.body.name,
        from_where: req.body.from_where,
        to_where: req.body.to_where,
        ticket_price: req.body.ticket_price,
        day_and_time: req.body.day_and_time,
        image: req.file.filename,
      };

      // 4 - INSERT Umrah INTO DB
      const query = util.promisify(conn.query).bind(conn);
      await query("INSERT INTO umrahs SET ?", umrah);
      res.status(200).json({
        msg: "Umrah created successfully!",
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

// UPDATE Umrah [ADMIN]
router.put(
  "/:id",

  // params
  admin,
  body("name")
    .isString()
    .withMessage("Please enter a valid name")
    .isLength({ min: 5 }),
  body("from_where")
    .isString()
    .withMessage("Please enter a valid city name")
    .isLength({ min: 5 }),
  body("to_where")
    .isString()
    .withMessage("Please enter a valid city name")
    .isLength({ min: 5 }),
  body("ticket_price"),

  body("day_and_time").isLength({ min: 5 }),

  async (req, res) => {
    try {
      // 1- VALIDATION REQUEST [manual, express validation]
      const query = util.promisify(conn.query).bind(conn);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // 2- CHECK IF Umrah EXISTS OR NOT
      const umrah = await query("SELECT * FROM umrahs WHERE id = ?", [
        req.params.id,
      ]);
      if (!umrah[0]) {
        res.status(404).json({ msg: "Umrah not found!" });
        return;
      }

      const umrahObj = {
        name: req.body.name,
        from_where: req.body.from_where,
        to_where: req.body.to_where,
        ticket_price: req.body.ticket_price,
        day_and_time: req.body.day_and_time,
      };

      await query("UPDATE umrahs SET ? WHERE id = ?", [umrahObj, umrah[0].id]);

      res.status(200).json({
        msg: "Umrah updated successfully",
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

// DELETE Umrah [ADMIN]
router.delete(
  "/:id", // params
  admin,
  async (req, res) => {
    try {
      // 1- VALIDATION REQUEST [manual, express validation]
      const query = util.promisify(conn.query).bind(conn);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      // 2- CHECK IF Umrah EXISTS OR NOT
      const umrah = await query("SELECT * FROM umrahs WHERE id = ?", [
        req.params.id,
      ]);
      if (!umrah[0]) {
        res.status(404).json({ msg: "Umrah not found!" });
        return;
      }

      await query("DELETE FROM umrahs WHERE id = ?", [umrah[0].id]);
      res.status(200).json({
        msg: "Umrah deleted successfully",
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

// LIST & SEARCH Umrah [ADMIN, USER]
router.get("/show", async (req, res) => {
  const query = util.promisify(conn.query).bind(conn);
  let search = "";
  if (req.query.search) {
    // QUERY PARAMS
    //res.json(req.query)
    search = `WHERE from_where LIKE '%${req.query.search}%' OR to_where LIKE '%${req.query.search}%'`;
  }
  const umrahs = await query(`SELECT * FROM umrahs ${search}`);
  umrahs.map((umrah) => {
    umrah.image = "http://" + req.hostname + ":4000/" + umrah.image;
  });

  res.status(200).json(umrahs);
});

// SHOW ALL Umrah
router.get("/all", async (req, res) => {
  const query = util.promisify(conn.query).bind(conn);
  const umrahs = await query("SELECT * FROM umrahs");
  if (!umrahs[0]) {
    res.status(404).json({ msg: "No Umrah found!" });
  }
  umrahs.map((u) => {
    u.image = "http://" + req.hostname + ":4000/" + u.image;
  });
  res.status(200).json(umrahs);
});

module.exports = router;
