const express = require('express');
const OmraCtrl = require('../controllers/omra-ctrl');
const router = express.Router();

router.post('/omra', OmraCtrl.createOmra); // Route to create a new Omra
router.delete('/omra/:id', OmraCtrl.deleteOmra); // Route to delete a Omra
router.get('/omras', OmraCtrl.getAllOmras); // Route to get all Omras
router.get('/', OmraCtrl.checkServiceRunning);

module.exports = router;