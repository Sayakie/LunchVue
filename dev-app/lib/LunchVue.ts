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
    this.request2(encodeURIComponent(school))
  }

  /**
   * 
   * @method reqeust2
   */
  public request2(school: string) {
    const promises: object[] = []
    const result: object[] = []

    async function process(_domain, query) {
      _domain.map(domain => {
        return promises.push(
          new Promise((resolve, reject) => {
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
                reject(err)
              } else if (res.statusCode == 200) {
                body.resultSVO.orgDVOList.map(school => {
                  console.log(JSON.stringify({
                    name: school.kraOrgNm,
                    code: school.orgCode,
                    type: school.schulCrseScCodeNm,
                    address: school.zipAdres
                  }))
                  resolve({
                    name: school.krgOrgNm,
                    code: school.orgCode,
                    type: school.schulCrseScCodeNm,
                    address: school.zipAdres
                  })
                })
              }
            }).on('error', err => {
              console.error(`Request failed: ${err}`)
            })
          })
        )
      })

      await Promise.all(promises)
            .then(result => {
              console.log(JSON.stringify(result))
              return JSON.stringify(result)
            })
            .catch(err => {
              return []
            })
    }

    return process(this.DOMAIN, encodeURIComponent(school))
  }
}

export default LunchVue.bootstrap()
