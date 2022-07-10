const { google } = require('googleapis');
const { client_email, private_key } = require('../../credentials/testCredentials.json');
const { XMLParser } = require('fast-xml-parser');
const { createEpostApiUrl, epostApiInstance, CryptoJS } = require('../../utils');

const getSpreadsheet = async () => {
  const spreadsheetId = process.env.SPREADSHEET_ID;

  // json 파일을 가지고 인증할 때 다음과 같이 사용합니다.
  // scope는 spread sheet만 주었습니다.
  const auth = new google.auth.JWT(client_email, null, private_key, [spreadsheetScope]);

  // google spread sheet api 가져오기
  const googleSheet = google.sheets({ version: 'v4', auth });

  // 실제 스프레드시트 내용 가져오기
  const context = await googleSheet.spreadsheets.values.get({ spreadsheetId, range: 'A:K' });

  return context;
};

const applyEms = async () => {
  const encryptedData = 'd30c973e3e4b5eb75462423c0aa100bc0ea16fc031987';

  const applyEMSResponse = new XMLParser().parse(
    (await epostApiInstance.post(createEpostApiUrl(epostApplyEMSDevApiId, true, encryptedData))).data,
  );

  return applyEMSResponse;
};

const cryptoTest = () => {
  CryptoJS.test();
};

module.exports = {
  getSpreadsheet,
  applyEms,
  cryptoTest,
};
