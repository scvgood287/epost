const { Router } = require('express');
const { OpenApiController } = require('../controllers');

const router = Router();

router.get('/spreadsheet', OpenApiController.getSpreadsheet);
router.post('/applyEMS', OpenApiController.applyEMS);
router.get('/cryptoTest', OpenApiController.cryptoTest);

module.exports = router;
