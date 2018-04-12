import * as request from 'request'

declare namespace LunchVue {
  export function find(school: string): LunchVue
}

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
   * 
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
        return
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
    const QUERY = encodeURIComponent(school)

    for (const i in this.DOMAIN) {
      this.request(this.DOMAIN[i], QUERY).then(data => {
        DATA.push(data)
      })
    }

    console.log(DATA)
    return JSON.stringify(DATA)
  }

  /**
   * 
   * @method request
   */
  private async request(domain, query) {
    const options = {
      method: 'GET',
      rejectUnauthorized: false, // for unable to verify the first certificate in nodejs, reject unauthorized is needed
      url: `http://${domain}/spr_ccm_cm01_100.do?kraOrgNm=${query}`,
      headers: {
        'Content-Type': 'applicaiton/json',
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
        console.log(school.kraOrgNm, school.orgCode, school.schulCrseScCodeNm, school.zipAdres)
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
}

export default LunchVue.bootstrap()