import * as request from 'request'
import * as cheerio from 'cheerio'

/**
 * It indicates that you have used some of the following library:
 * neis-meal 1.0.0 (https://github.com/OnLiU211/neis-meal)
 * 
 * Thank you very much for your help ⸻ @Danuel (https://twitter.com/_danuel_)
 */

export type NOT_EXISTS = ''
export type MenuTable = (NOT_EXISTS | DailyMenu)[]

export type Menu = NOT_EXISTS | {
  food: Food
  nutrition: Nutrition
}

export type DailyMenu = {
  breakfast: Menu
  lunch: Menu
  dinner: Menu
}

export type Food = string[]
export type Nutrition = string[] | null

export type HTML = string

export const NOT_EXISTS = ''
export const enum MENU {
  BREAKFAST = '조식',
  LUNCH = '중식',
  DINNER = '석식'
}

/**
 * LunchVue Server Library v0.1.4 (https://github.com/Kurosnape/LunchVue)
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

            return { name, code, type, address, domain }
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
  async get(domain: string, code: string, month: number) {
    const result = await new Promise((resolve, reject): void => {
      const payload = {
        uri: `http://${ domain }/sts_sci_md00_001.do?schulCode=${ code }&schulCrseScCode=4&ay=${ new Date().getFullYear() }&mm=${ ('0' + month).substr(-2) }`,
        rejectUnauthorized: false,
        gzip: true,
        headers: {
          'User-Agent': 'lunchvue-request-bot'
        }
      }

      const validator = (error, res, body): MenuTable => {
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

        const data = LunchVue.getMeals(body)
        resolve(data)
      }

      request(payload, validator)
    })

    return result
  }

  /**
   * @class LunchVue
   * @method getMeals
   * @author danuel
   */
  protected static getMeals(body: HTML): MenuTable {
    const pureElement = LunchVue.normalizationHTML(body)

    return pureElement.map((value: string, index: number) => {
      const menuTable = value === NOT_EXISTS
        ? NOT_EXISTS
        : LunchVue.getDayMenu(value)

      return menuTable
    })
    .filter((value: any) => !!value)
  }

  /**
   * @class LunchVue
   * @method normalizationHTML
   * @author danuel
   */
  protected static normalizationHTML(body: string) {
    // 영양소 성분이 없는 식단도 줄 바꿈을 해주어야하기 때문에
    // <br> 태그가 제거되기 전에 필터링합니다.
    //
    // 영양소 성분으로 임시적으로 'HACKED'합니다.
    // 나중에 수정해야합니다. 또한 영양소 성분도 정상 작동하지 않을겁니다.
    const breakToken = '1.'
    const $ = cheerio.load(body.replace(/<br\s*[\/]?>/gi, breakToken), {
      xmlMode: false
    })

    const separateElement = 'tbody tr td'
    const divisionalExpression = /\s+/
    return $(separateElement).map(function(index, element) {
      return $(this).text().replace(divisionalExpression, NOT_EXISTS)//.replace(new RegExp('__BREAK__', 'g'), '<br>')
    }).get()
    .filter((value) => value !== ' ')
  }

  /**
   * @class LunchVue
   * @method getDayMenu
   * @author danuel
   */
  protected static getDayMenu(value: string): DailyMenu {
    return {
      breakfast: LunchVue.extractMenu(MENU.BREAKFAST, value),
      lunch: LunchVue.extractMenu(MENU.LUNCH, value),
      dinner: LunchVue.extractMenu(MENU.DINNER, value)
    }
  }

  /**
   * @class LunchVue
   * @method extractMenu
   * @author danuel
   */
  protected static extractMenu(menu: MENU, value: string): Menu {
    const pattern = new RegExp(`(\\[${ menu }\\])(.+?)(?=\\[)`)

    // hack for pattern-matching
    const __value = value + '['
    const __menu = __value.match(pattern)

    return (__menu)
      ? LunchVue.separateMenu(__menu[2])
      : NOT_EXISTS
  }

  /**
   * @class LunchVue
   * @method separateMenu
   * @author danuel
   */
  protected static separateMenu(menu: string): Menu {
    return {
      food: menu
        .split(/\d{1,2}\./g)
        .filter((value) => !!value),
      nutrition: menu
        .match(/(\d{1,2}\.)+/g)
    }
  }
}

export default LunchVue.bootstrap()
