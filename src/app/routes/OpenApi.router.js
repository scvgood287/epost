const { Router } = require('express');
const { OpenApiController } = require('../controllers');

const router = Router();

router.get('/cryptoTest', OpenApiController.cryptoTest);

module.exports = router;
