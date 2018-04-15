import * as request from 'request'

/**
 * LunchVue Server Library v0.1.4 (https://github.com/Kurosnape/LunchVue/)
 * Copyright 2018 LunchVue Authors
 * Licensed under MIT (https://github.com/Kurosnape/LunchVue/blob/master/LICENSE)
 */
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
   * @class bootstrap
   * @method bootstrap
   * @static
   * @return {LunchVue}
   */
  public static bootstrap(): LunchVue {
    return new LunchVue()
  }

  /**
   * Initialize LunchVue
   * 
   * @class LunchVue
   * @method init
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
   * Ask all education offices to check there is a school.
   * 
   * @class LunchVue
   * @method reqeust2
   */
  async request2(school: string) {
    const query = encodeURIComponent(school)
    const payload = {
      uri: '',
      rejectUnauthorized: false, // for unable to verify the first certificate in nodejs, reject unauthorized is needed
      gzip: true,
      json: true,
      headers: {
        'User-Agent': 'lunchvue-request-bot'
      }
    }

    const resultList = this.DOMAIN.map((domain): Promise<any[]> =>
      new Promise((resolve, reject): void => {
        payload.uri = `http://${ domain }/spr_ccm_cm01_100.do?kraOrgNm=${ query }`

        const validator = (error, res, body): void => {
          if (error) {
            reject(error)
            return
          }

          if (res.statusCode !== 200) {
            const message = 'invalid request'
            const reason = new Error(message)
            reject(reason)
            return
          }

          const data = body.resultSVO.orgDVOList
          const spreadList = data.map((spread) => {
            const {
              kraOrgNm: name,
              orgCode: code,
              schulCrseScCodeNm: type,
              zipAdres: address
            } = spread

            return { name, code, type, address }
          })

          resolve(spreadList)
        }

        request(payload, validator)
      }))

    const result = await Promise.all(resultList)
    return result.filter((data): boolean => (data.length !== 0))
  }

  /**
   * Get meals from government.
   * 
   * @class LunchVue
   * @method get
   */
  public get() {

  }
}

export default LunchVue.bootstrap()
