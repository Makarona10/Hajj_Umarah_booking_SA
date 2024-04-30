const router = require("express").Router();
const controller = require("./Request.controller")


router.post("/create/:appid/:userid", controller.create);

router.get("/all", controller.list_all);

//admin 
router.put("/accept/:id/:reqid", controller.accept_req);

//admin 
router.put("/decline/:id", controller.decline_req);

router.get("/history/:id", controller.list_history);

module.exports = router;