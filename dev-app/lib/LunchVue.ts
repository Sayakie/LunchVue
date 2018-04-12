import * as request from 'request'

declare namespace LunchVue {
  export function find(school: string): LunchVue
}

//export namespace LunchVue {
class LunchVue {
  PREFIX: string
  TYPE: object
  SUFFIX: string
  DOMAIN: Array<string>

  constructor() {
    this.init()
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

    for (const i in this.TYPE) {
      // Because Gyeongsangbuk-do(경상북도) use different domain
      if (this.TYPE[i] === 'gbe') {
        this.DOMAIN.push(this.PREFIX + this.TYPE[i] + 'kr')
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
    const QUERY = encodeURIComponent(school)

    for (const i in this.DOMAIN) {
      request({
        method: 'GET',
        rejectUnauthorized: false, // for unable to verify the first certificate in nodejs, reject unauthorized is needed
        url: `https://${this.DOMAIN[i]}/spr_ccm_cm01_100.do?kraOrgNm=${QUERY}`,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'lunchvue-request-bot'
        },
        json: true
      }, (err, res, data) => {
        if (err) {
          return console.error(`No such dep: ${err}`)
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
  }
}
//}

export default LunchVue