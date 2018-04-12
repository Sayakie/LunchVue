const request = require('request')

const PREFIX = 'stu.'
const SUFFIX = '.go.kr'
const TYPE = [
  'sen',  // 서울특별시
  'pen',  // 부산광역시
  'dge',  // 대구광역시
  'ice',  // 인천광역시
  'gen',  // 광주광역시
  'dje',  // 대전광역시
  'use',  // 울산광역시
  'sje',  // 세종특별자치시
  'goe',  // 경기도
  'gwe',  // 강원도
  'cbe',  // 충청북도
  'cne',  // 충청남도
  'jbe',  // 전라북도
  'jne',  // 전라남도
  'gbe',  // 경상북도
  'gne',  // 경상남도
  'jje'   // 제주도
]
const DOMAIN = []
const QUERY = encodeURIComponent('덕인')

for (const i in TYPE) {
  DOMAIN.push(PREFIX + TYPE[i] + SUFFIX)
}

for (i in DOMAIN) {
  // 경상북도는 왜 주소가 다를까
  if (DOMAIN[i] === 'stu.gbe.go.kr') {
    DOMAIN[i] = 'stu.gbe.kr'
  }

  request({
    method: 'GET',
    rejectUnauthorized: false, // for unable to verify the first certificate in nodejs, reject unauthorized is needed
    url: `https://${DOMAIN[i]}/spr_ccm_cm01_100.do?kraOrgNm=${QUERY}`,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'request-bot'
    },
    json: true
  }, (err, res, data) => {
    if (err) {
      throw TypeError(`No such dep: ${err}`)
    }

    data.resultSVO.orgDVOList.map( school => {
      return {
        name: school.kraOrgNm,
        code: school.orgCode,
        type: school.schulCrseScCodeNm,
        address: school.zipAdres
      }
    })
  }).on('error', err => {
    throw TypeError(`Request failed: ${err}`)
  })
}

  /*
  request({
    uri: `https://${domain}/spr_ccm_cm01_100.do?kraOrgNm=${QUERY}`,
    headers: {
      'User-Agent': 'request'
    },
    json: true
  }, (err, res, data) => {
    if (err) {
      throw TypeError(`No such dep: ${err}`)
    }
    
    data.resultSVO.orgDVOList.map( school => {
      return {
        name: school.kraOrgNm,
        code: school.orgCode,
        type: school.schulCrseScCodeNm,
        address: school.zipAdres
      }
    } )
  }).on('error', (err) => {
    throw TypeError(`Request failed: ${err}`)
  })
  */


