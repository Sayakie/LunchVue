import * as request from 'request'
//import { Response } from 'express'

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
  public async find(school: string) {
    const QUERY = encodeURIComponent(school)
    const PROMISE = []
    const DATA = []

    for (const DOMAIN of this.DOMAIN) {
      PROMISE.push(new Promise((resolve, reject) => {
        request({
          rejectUnauthorized: false, // for unable to verify the first certificate in nodejs, reject unauthorized is needed
          uri: `http://${DOMAIN}/spr_ccm_cm01_100.do?kraOrgNm=${QUERY}`,
          headers: {
            'User-Agent': 'lunchvue-request-bot'
          },
          gzip: true,
          json: true
        }, (err, response, body) => {
          if (!err && response.statusCode == 200) {
            body.resultSVO.orgDVOList.map( school => {
                /*
                console.log(JSON.stringify({
                  name: school.kraOrgNm,
                  code: school.orgCode,
                  type: school.schulCrseScCodeNm,
                  address: school.zipAdres
                }))*/
              resolve(JSON.stringify({
                  name: school.kraOrgNm,
                  code: school.orgCode,
                  type: school.schulCrseScCodeNm,
                  address: school.zipAdres
              }))
            })
          } else {
            reject(`Not Found: ${err}`)
          }
        }).on('error', err => {
          reject(`Request failed: ${err}`)
        })
      }))
    }

    Promise.all(PROMISE)
      .then(data => {
        console.log(data)
        return data
      })
      .catch(reason => {
        console.error(reason)
        return []
      })
    /*
    for (const domain of this.DOMAIN) {
      request({
        rejectUnauthorized: false, // for unable to verify the first certificate in nodejs, reject unauthorized is needed
        uri: `http://${domain}/spr_ccm_cm01_100.do?kraOrgNm=${encodeURIComponent(school)}`,
        headers: {
          'User-Agent': 'lunchvue-request-bot'
        },
        gzip: true,
        json: true
      }, (err, response, body) => {
        if (!err && response.statusCode == 200) {
          body.resultSVO.orgDVOList.map( school => {
            console.log(JSON.stringify({
              name: school.kraOrgNm,
              code: school.orgCode,
              type: school.schulCrseScCodeNm,
              address: school.zipAdres
            }))
            return res.send(
              JSON.stringify({
                name: school.kraOrgNm,
                code: school.orgCode,
                type: school.schulCrseScCodeNm,
                address: school.zipAdres
              })
            )
          })
        } else {
          return res.send(404)
        }
      }).on('error', err => {
        return console.error(`Request failed: ${err}`)
      })
    }*/

    //return DATA
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