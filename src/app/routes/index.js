const { Router } = require('express');
const OpenApiRouter = require('./OpenApi.router');

const router = Router();

router.use('/OpenApi', OpenApiRouter);

module.exports = router;
