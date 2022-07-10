const { OpenApiService } = require('../services');

const getSpreadsheet = async (req, res, next) => {
  const context = await OpenApiService.getSpreadsheet();

  res.json(context);
};

const applyEMS = async (req, res, next) => {
  const { body } = req;

  const queryString = await OpenApiService.applyEMS(body);

  res.json(queryString);
};

const cryptoTest = (req, res, next) => {
  OpenApiService.cryptoTest();
  res.json('cryptoTest');
};

module.exports = {
  getSpreadsheet,
  applyEMS,
  cryptoTest,
};
