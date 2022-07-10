const { google } = require('googleapis');
const { client_email, private_key } = require('../../credentials/testCredentials.json');
const { XMLParser } = require('fast-xml-parser');
const { createEpostApiUrl, epostApiInstance, CryptoJS } = require('../../utils');
const { spreadsheetScope, epostApplyEMSDevApiId } = require('../../constants');

// @ts-check

/**
 * @typedef {String | Number} StringOrNumber
 */

/**
 * @typedef {'Y' | 'N'} Whether
 */

/**
 * @typedef {Object} ApplyEMSRequest
 * @property {String} custno - (우체국) 고객번호 ex) 0011223344
 * @property {String} apprno - 계약승인번호 ex) 10186H0000
 * @property {String} premiuncd - 국제우편물 구분코드 ex) 31
 * @property {String} em_ee - 국제우편물 종류코드 ex) em
 * @property {String} countrycd - 도착 국가코드 ex) US
 * @property {StringOrNumber} totweight - 우편물 총중량(g) ex) 3000
 * @property {Whether} boyn - 보험가입 여부 ex) N
 * @property {StringOrNumber} [boprc] - 보험가입 금액(KRW, ₩) ex) 12000
 * @property {Whether} [nextdayreserveyn] - 익일(다음날 평일) 오전 예약신청 여부 ex) Y
 * @property {String} [reqhhmi] - 익일(다음날 평일) 오전 예약신청 시간 (입력값 범위: 0000 ~ 1159) ex) 0900
 * @property {String} [orderno] - 업체측 주문번호 (업체측 unique key) ex) K201111700015
 * @property {Whether} [premiumexportyn] - 수출서류 제출 여부 (EMS프리미엄용) ex) N
 * @property {String} [cdremark] - 브라질[BR]: 세금식별번호 ex) 123.456.789-12 12.345.678/1234-56
 * @property {String} sender - 발송인 이름 ex) Song Lee
 * @property {String} senderzipcode - 발송인 우편번호 ex) 402701
 * @property {String} senderaddr1 - 발송인 주소1(상세) ex) JaYng-dong 123
 * @property {String} senderaddr2 - 발송인 주소2(기본) ex) GwangJin ,Seoul
 * @property {String} sendertelno1 - 발송인 전화번호(국가코드) ex) 82
 * @property {String} sendertelno2 - 발송인 전화번호 ex) 2
 * @property {String} sendertelno3 - 발송인 전화번호 ex) 942
 * @property {String} sendertelno4 - 발송인 전화번호 ex) 2774
 * @property {String} sendermobile1 - 발송인 휴대전화번호(국가코드) ex) 82
 * @property {String} sendermobile2 - 발송인 휴대전화번호 ex) 10
 * @property {String} sendermobile3 - 발송인 휴대전화번호 ex) 4791
 * @property {String} sendermobile4 - 발송인 휴대전화번호 ex) 2774
 * @property {String} [senderemail] - 발송인 이메일주소 ex) sender@email.com
 * @property {String} [snd_message] - 배송 메시지(집하지시내역) ex) thanks
 * @property {String} receivename - 수취인 이름 ex) James Lee
 * @property {String} receivezipcode - 수취인 우편번호 ex) 07803
 * @property {String} [receiveaddr1] - 수취인 주소1(주/도) ex) new jersey
 * @property {String} [receiveaddr2] - 수취인 주소2(시/군) ex) min hill
 * @property {String} receiveaddr3 - 수취인 주소3(상세) ex) St. temp 12
 * @property {String} [buildnm] - 수취인 건물명(K-Packet, 미국행인 경우) ex) abc building
 * @property {String} receivetelno1 - 수취인 전화번호(국가코드) ex) 81
 * @property {String} receivetelno2 - 수취인 전화번호 ex) 1245
 * @property {String} receivetelno3 - 수취인 전화번호 ex) 4857
 * @property {String} receivetelno4 - 수취인 전화번호 ex) 4563
 * @property {String} receivetelno - 수취인 전체 전화번호 ex) 010-1234-1234
 * @property {String} [receivemail] - 수취인 이메일주소 ex) jlee@email.com
 * @property {String} [orderprsnzipcd] - 주문자 우편번호 ex) 123456
 * @property {String} [orderprsnaddr1] - 주문자 주소1(상세) ex) JaYng-dong 123
 * @property {String} [orderprsnaddr2] - 주문자 주소2(기본) ex) GwangJin, Seoul
 * @property {String} [orderprsnnm] - 주문자명 ex) Pack Jin Hyeng
 * @property {String} [orderprsntelnno] - 주문자 전화번호(국가코드) ex) 82
 * @property {String} [orderprsntelfno] - 주문자 전화번호 ex) 2
 * @property {String} [orderprsntelmno] - 주문자 전화번호 ex) 942
 * @property {String} [orderprsntellno] - 주문자 전화번호 ex) 2774
 * @property {String} [orderprsntelno] - 주문자 전체 전화번호 ex) 02-942-2774
 * @property {String} [orderprsnhtelfno] - 주문자 휴대전화번호 ex) 10
 * @property {String} [orderprsnhtelmno] - 주문자 휴대전화번호 ex) 4791
 * @property {String} [orderprsnhtellno] - 주문자 휴대전화번호 ex) 2774
 * @property {String} [orderprsnhtelno] - 주문자 전체 휴대전화번호 ex) 010-4791-2774
 * @property {String} [orderprsnemailid] - 주문자 이메일주소 ex) orderer@epost.kr
 * @property {String} EM_gubun - 상품구분(내용품 유형) ex) Merchandise;Merchandise;Merchandise
 * @property {String} [contents] - 내용품명 ex) clocks;toy;milk
 * @property {String} [number] - 개수 ex) 1;2;3
 * @property {String} [weight] - 순중량(g) [=개당 중량*개수] ex) 2900;3000;4000
 * @property {String} [value] - 가격(USD, EUR) [=단가*개수] ex) 100;200;300
 * @property {String} [hs_code] - HS-Code ex) 9105100000;3921199040;4311212345
 * @property {String} [origin] - 생산지 ex) KR;KR;US
 * @property {String} [modelno] - 규격(모델명) ex) clocks;toy;milk
 * @property {Whether} [ecommerceyn] - 관세청 수출우편물 정보제공 여부 ex) Y
 * @property {String} [exportsendprsnnm] - 수출화주 성명 또는 상호 ex) Pack Jin Hyeng
 * @property {String} [exportsendprsnaddr] - 수출화주 주소 ex) Seoul Gangnamgu Samseong 2 dong Gangnamgu Office 219ho
 * @property {String} [bizregno] - 사업자번호 ex) 1234567890
 * @property {Whether} [xprtnoyn] - 수출이행 등록 여부 ex) Y
 * @property {String} [xprtno1] - 수출신고번호 ex) 1000019000001X
 * @property {String} [xprtno2] - 수출신고번호 ex) 1000019000002X
 * @property {String} [xprtno3] - 수출신고번호 ex) 1000019000003X
 * @property {String} [xprtno4] - 수출신고번호 ex) 1000019000004X
 * @property {Whether} [totdivsendyn1] - 전량분할 발송여부 (Y:전량, N:분할) ex) Y
 * @property {Whether} [totdivsendyn2] - 전량분할 발송여부 (Y:전량, N:분할) ex) Y
 * @property {Whether} [totdivsendyn3] - 전량분할 발송여부 (Y:전량, N:분할) ex) Y
 * @property {Whether} [totdivsendyn4] - 전량분할 발송여부 (Y:전량, N:분할) ex) Y
 * @property {StringOrNumber} [wrapcnt1] - 선기적 포장개수 ex) 1
 * @property {StringOrNumber} [wrapcnt2] - 선기적 포장개수 ex) 1
 * @property {StringOrNumber} [wrapcnt3] - 선기적 포장개수 ex) 5
 * @property {StringOrNumber} [wrapcnt4] - 선기적 포장개수 ex) 10
 * @property {String} [recomporegipocd] - 추천 우체국기호 ex) 12345
 * @property {String} [skustockmgmtno] - SKU 재고관리번호 ex) 1234567891ABCD
 * @property {String} [paytypecd] - 결제수단 ex) 01
 * @property {String} [currunit] - 결제통화 ex) KRW
 * @property {String} [payapprno] - 결제승인번호 ex) 1234567891ABCD
 * @property {String} [dutypayprsncd] - 관세납부자 ex) 2
 * @property {StringOrNumber} [dutypayamt] - 납부 관세액 ex) 12345678.12
 * @property {String} [dutypaycurr] - 관세 납부통화 ex) KRW
 * @property {StringOrNumber} boxlength - 우편물(포장상자) 가로길이(cm) ex) 1234.12
 * @property {StringOrNumber} boxwidth - 우편물(포장상자) 세로길이(cm) ex) 1234.12
 * @property {StringOrNumber} boxheight - 우편물(포장상자) 높이(cm) ex) 1234.12
 * @property {Whether} [volmwghtapplyexceptyn] - 부피중량 적용제외 여부 ex) Y
 * @property {String} [vatdscrnno] - IOSS 식별 번호 (12자리) OR EORI 식별 번호 (14자리) ex) IM1234567890 OR GB123456789000
 * @property {'USD' | 'EUR'} currunitcd - 유럽행(EU소속) : USD, EUR 중 택일 / 유럽(EU)외 국가 : USD만 가능(※영국은 EU 탈퇴했으므로 USD만 가능) ex) USD OR EUR
 */

/**
 * @typedef {Object} ApplyEMSResponse
 * @property {String} receiveseq - 접수번호
 * @property {StringOrNumber} prerecevprc - 우편요금(KRW, ₩)
 * @property {10 | '10' | 12 | '12'} prcpaymethcd - 요금 납부방법 10(즉납) / 12(후납)
 * @property {StringOrNumber} treatporegipocd - 우편용 국기호
 * @property {String} treatporegipoengnm - 우체국 영문영
 * @property {String} orderno - 업체측 주문번호
 * @property {StringOrNumber} reqno - 예약번호
 * @property {String} regino - 등기번호
 * @property {String} exchgPoCd - 교환국코드
 * @property {StringOrNumber} reservedivcd - 예약신청 구분 1: 즉시 예약 / 2: 익일 오전 예약
 * @property {StringOrNumber} reqymd - 예약신청 일자
 * @property {StringOrNumber} reqhhmi - 예약신청 시간
 * @property {String} noticeMsg - API 공지사항
 */

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

/**
 * @param {ApplyEMSRequest} applyEMSRequest
 * @returns {ApplyEMSResponse}
 */
const applyEMS = async applyEMSRequest => {
  // const encryptedData = 'd30c973e3e4b5eb75462423c0aa100bc0ea16fc031987';

  const queryString = Object.entries(applyEMSRequest)
    .reduce((queryString, [param, value]) => queryString + `${param}=${value}&`, '')
    .slice(0, -1);
  console.log(queryString);

  // const encryptedQueryString = CryptoJS.SEED.encrypt(
  //   CryptoJS.enc.Utf8.parse(queryString),
  //   CryptoJS.enc.Hex.parse('!PbutouchTest!@#'),
  //   { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.ZeroPadding },
  // );
  // const decryptedQueryString = CryptoJS.enc.Utf8.stringify(
  //   CryptoJS.SEED.decrypt(encryptedQueryString, CryptoJS.enc.Hex.parse('!PbutouchTest!@#'), {
  //     mode: CryptoJS.mode.ECB,
  //     padding: CryptoJS.pad.ZeroPadding,
  //   }),
  // );

  const plainValue = CryptoJS.enc.Utf8.parse(queryString); // 평문
  const keyText = 'llnoteTest!@#123'; //KISA_SEED_ECB.java에서 key값은 16byte 고정
  const keyHex = CryptoJS.string_to_utf8_hex_string(keyText);
  const key = CryptoJS.enc.Hex.parse(keyHex); //!PbutouchTest!@#

  const encrypted = CryptoJS.SEED.encrypt(plainValue, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.ZeroPadding,
  });
  const decrypted = CryptoJS.SEED.decrypt(encrypted, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.ZeroPadding,
  });
  const words = CryptoJS.enc.Base64.parse(encrypted.toString());
  console.log('--------------암호화-------------');
  console.log('공통키 : ' + keyText);
  console.log('공통키(hex) : ' + keyHex);
  console.log('평문 : ' + queryString);
  console.log('--------------------------------');
  console.log('암호화(base64) : ' + encrypted.toString());
  console.log('암호화(hex) : ' + words.toString());
  console.log('복호화(utf8) : ' + CryptoJS.enc.Utf8.stringify(decrypted));
  console.log('복호화(hex) : ' + decrypted.toString());

  console.log('--------------복호화------------');
  console.log('공통키 : ' + keyText);
  const cipherText = encrypted.toString();
  console.log('암호값 : ' + cipherText);
  console.log('--------------------------------');
  const decryptedCipherText = CryptoJS.SEED.decrypt(cipherText, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.ZeroPadding,
  });
  console.log('복호화(utf8) : ' + CryptoJS.enc.Utf8.stringify(decryptedCipherText));
  console.log('복호화(hex) : ' + decryptedCipherText.toString());

  return queryString;

  // const applyEMSResponse = new XMLParser().parse(
  //   (await epostApiInstance.post(createEpostApiUrl(epostApplyEMSDevApiId, encryptedData, true, 001))).data,
  // );

  // return applyEMSResponse;
};

const cryptoTest = () => {
  CryptoJS.test();
};

module.exports = {
  getSpreadsheet,
  applyEMS,
  cryptoTest,
};
