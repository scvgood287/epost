const { OpenApiService } = require('../services');

const cryptoTest = (req, res, next) => {
  OpenApiService.cryptoTest();
  res.json('cryptoTest');
};

module.exports = {
  cryptoTest,
};
