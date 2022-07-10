const axios = require('axios');
const { epostUrl } = require('../constants');
const { Agent: httpAgent } = require('http');
const { Agent: httpsAgent } = require('https');
const CryptoJS = require('./customCryptoJS');

const createEpostApiUrl = (apiUrl, isApply, encryptedData) =>
  `${apiUrl}?${isApply ? '' : 'reg'}key=${process.env.AUTHENTICATION_KEY}&regData=${encryptedData}`;
const epostApiInstance = axios.create({
  baseURL: epostUrl,
  proxy: {
    host: process.env.API_DOMAIN_URL,
    port: Number(process.env.PORT),
  },
  httpAgent: new httpAgent({ keepAlive: true }),
  httpsAgent: new httpsAgent({ keepAlive: true }),
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246',
  },
});

module.exports = {
  createEpostApiUrl,
  epostApiInstance,
  CryptoJS,
};
