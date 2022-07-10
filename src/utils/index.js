const axios = require('axios');
const { epostUrl } = require('../constants');
const { Agent: httpAgent } = require('http');
const { Agent: httpsAgent } = require('https');
const CryptoJS = require('./customCryptoJS');

/**
 *
 * @param {String} apiUrl - 사용할 api
 * @param {String} encryptedData - 암호화된 신청 정보
 * @param {Boolean} isApply - 신청이냐 아니냐
 * @param {'000' | '001' | ''} [option=''] - 000 : API공지사항(noticeMsg) 추가 출력 / 001 : API공지사항(noticeMsg), 교환국코드(exchgPoCd) 추가 출력 / 기본값(미입력 시) : (null) — option 요청변수를 사용하고 입력값을 입력하지 않은 경우
 * @returns
 */
const createEpostApiUrl = (apiUrl, encryptedData, isApply, option = '') =>
  `${apiUrl}?${isApply ? '' : 'reg'}key=${process.env.AUTHENTICATION_KEY}&option=${option}&regData=${encryptedData}`;
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
