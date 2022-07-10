const { Router } = require('express');
const apiRouters = require('./routes');

const router = Router();

router.get('/healthCheck', (req, res, next) => {
  res.status(200);
  res.json('OK');
});

router.use('/api', apiRouters);

module.exports = router;
