import * as request from 'request'

class LunchVue {
  PREFIX: string
  TYPE: object
  SUFFIX: string
  DOMAIN: string[]
  DATA: object[]

  constructor() {
    this.init()
  }

  /**
   * Bootstrap the LunchVue Library.
   * 
   * @method bootstrap
   * @return {LunchVue}
   */
  public static bootstrap() {
    return new LunchVue()
  }

  /**
   * Initialize LunchVue
   * 
   * @private
   */
  private init() {
    this.PREFIX = 'stu.'
    this.SUFFIX = '.go.kr'
    this.TYPE = [
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
    this.DOMAIN = []
    this.DATA = []

    for (const i in this.TYPE) {
      // Because Gyeongsangbuk-do(경상북도) use different domain
      if (this.TYPE[i] === 'gbe') {
        this.DOMAIN.push(this.PREFIX + this.TYPE[i] + '.kr')
        continue
      }

      this.DOMAIN.push(this.PREFIX + this.TYPE[i] + this.SUFFIX)
    }
  }

  /**
   * find
   * 
   * @public
   * @param school
   */
  public find(school: string) {
    const DATA = []
    /*
    for (const i in this.DOMAIN) {
      this.request(this.DOMAIN[i], QUERY).then(data => {
        console.log(data)
        DATA.push(data)
      })
    }*/

    DATA.push(this.request2(encodeURIComponent(school)))

    /*return JSON.stringify([{"name":"덕인초등학교","code":"J100005395","type":"초등학교","address":"경기도 안산시 단원구 와동 1~400"},
    {"name":"목포덕인중학교","code":"Q100000827","type":"중학교","address":"전라남도 목포시 죽교동 1~93"},
    {"name":"목포덕인고등학교","code":"Q100000199","type":"고등학교","address":"전라남도 목포시 죽교동 1~93"},
    {"name":"대구덕인초등학교병설유치원","code":"D100000484","type":"유치원","address":"대구광역시 달서구 본리동"},
    {"name":"대구덕인초등학교","code":"D100000423","type":"초등학교","address":"대구광역시 달서구 본리동"}])*/
    console.log(`DATA: ${DATA}`)
    return DATA
  }

  /**
   * 
   * @method request
   */
  private async request(domain, query) {
    const options = {
      rejectUnauthorized: false, // for unable to verify the first certificate in nodejs, reject unauthorized is needed
      uri: `http://${domain}/spr_ccm_cm01_100.do?kraOrgNm=${query}`,
      headers: {
        'User-Agent': 'lunchvue-request-bot'
      },
      gzip: true,
      json: true
    }

    await request(options, (err, res, body) => {
      if (err) {
        return console.error(`No such dep: ${err}`)
      }

      body.resultSVO.orgDVOList.map( school => {
        //console.log(school.kraOrgNm, school.orgCode, school.schulCrseScCodeNm, school.zipAdres)
        return {
          name: school.kraOrgNm,
          code: school.orgCode,
          type: school.schulCrseScCodeNm,
          address: school.zipAdres
        }
      })
    }).on('error', err => {
      console.error(`Request failed: ${err}`)
    })
  }

  /**
   * 
   * @method reqeust2
   */
  private request2(query) {
    for (const domain of this.DOMAIN) {
      request({
        rejectUnauthorized: false, // for unable to verify the first certificate in nodejs, reject unauthorized is needed
        uri: `http://${domain}/spr_ccm_cm01_100.do?kraOrgNm=${query}`,
        headers: {
          'User-Agent': 'lunchvue-request-bot'
        },
        gzip: true,
        json: true
      }, (err, res, body) => {
        if (err) {
          return console.error(`No such dep: ${err}`)
        }
  
        body.resultSVO.orgDVOList.map( school => {
          console.log(JSON.stringify({
            name: school.kraOrgNm,
            code: school.orgCode,
            type: school.schulCrseScCodeNm,
            address: school.zipAdres
          }))
          return JSON.stringify({
            name: school.kraOrgNm,
            code: school.orgCode,
            type: school.schulCrseScCodeNm,
            address: school.zipAdres
          })
        })
      }).on('error', err => {
        console.error(`Request failed: ${err}`)
      })
    }
  }
}

export default LunchVue.bootstrap()