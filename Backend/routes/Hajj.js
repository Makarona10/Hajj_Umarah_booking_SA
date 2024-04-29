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
// CREATE Hajj [ADMIN]
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

      // 3- PREPARE Hajj OBJECT
      const hajj = {
        name: req.body.name,
        from_where: req.body.from_where,
        to_where: req.body.to_where,
        ticket_price: req.body.ticket_price,
        day_and_time: req.body.day_and_time,
        image: req.file.filename,
      };

      // 4 - INSERT Hajj INTO DB
      const query = util.promisify(conn.query).bind(conn);
      await query("INSERT INTO hajjs SET ?", hajj);
      res.status(200).json({
        msg: "Hajj created successfully!",
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

// UPDATE Hajj [ADMIN]
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

      // 2- CHECK IF Hajj EXISTS OR NOT
      const hajj = await query("SELECT * FROM hajjs WHERE id = ?", [
        req.params.id,
      ]);
      if (!hajj[0]) {
        res.status(404).json({ msg: "Hajj not found!" });
        return;
      }

      const hajjObj = {
        name: req.body.name,
        from_where: req.body.from_where,
        to_where: req.body.to_where,
        ticket_price: req.body.ticket_price,
        day_and_time: req.body.day_and_time,
      };

      await query("UPDATE hajjs SET ? WHERE id = ?", [hajjObj, hajj[0].id]);

      res.status(200).json({
        msg: "Hajj updated successfully",
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

// DELETE Hajj [ADMIN]
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
      // 2- CHECK IF Hajj EXISTS OR NOT
      const hajj = await query("SELECT * FROM hajjs WHERE id = ?", [
        req.params.id,
      ]);
      if (!hajj[0]) {
        res.status(404).json({ msg: "Hajj not found!" });
        return;
      }

      await query("DELETE FROM hajjs WHERE id = ?", [hajj[0].id]);
      res.status(200).json({
        msg: "Hajj deleted successfully",
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

// LIST & SEARCH Hajj [ADMIN, USER]
router.get("/show", async (req, res) => {
  const query = util.promisify(conn.query).bind(conn);
  let search = "";
  if (req.query.search) {
    // QUERY PARAMS
    //res.json(req.query)
    search = `WHERE from_where LIKE '%${req.query.search}%' OR to_where LIKE '%${req.query.search}%'`;
  }
  const hajjs = await query(`SELECT * FROM hajjs ${search}`);
  hajjs.map((hajj) => {
    hajj.image = "http://" + req.hostname + ":4000/" + hajj.image;
  });

  res.status(200).json(hajjs);
});

// SHOW ALL Hajj
router.get("/all", async (req, res) => {
  const query = util.promisify(conn.query).bind(conn);
  const hajjs = await query("SELECT * FROM hajjs");
  if (!hajjs[0]) {
    res.status(404).json({ msg: "No Hajj found!" });
  }
  hajjs.map((h) => {
    h.image = "http://" + req.hostname + ":4000/" + h.image;
  });
  res.status(200).json(hajjs);
});

module.exports = router;
