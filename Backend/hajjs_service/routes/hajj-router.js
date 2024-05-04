const express = require('express');
const HajjCtrl = require('../controllers/hajj-ctrl');
const router = express.Router();

router.post('/hajj', HajjCtrl.createHajj); // Route to create a new user
router.delete('/hajj/:id', HajjCtrl.deleteHajj); // Route to delete a user
router.get('/hajjs', HajjCtrl.getAllHajjs); // Route to get all users
router.get('/', HajjCtrl.checkServiceRunning);

module.exports = router;