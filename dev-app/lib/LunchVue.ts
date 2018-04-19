import * as request from 'request'
import * as cheerio from 'cheerio'

/**
 * It indicates that you have used some of the following library:
 * neis-meal 1.0.0 (https://github.com/OnLiU211/neis-meal)
 * 
 * Thank you very much for your help ⸻ @Danuel (https://twitter.com/_danuel_)
 */

interface Domain {
  readonly name: string
  readonly ltd?: string
}

interface Spread {
  readonly name: string
  readonly code: string
  readonly type: string
  readonly address: string
  readonly domain: string
}

type NOT_EXISTS = ''
type MenuTable = (NOT_EXISTS | DailyMenu)[]

type Menu = NOT_EXISTS | {
  food: Food
  nutrition: Nutrition
}

type DailyMenu = {
  breakfast: Menu
  lunch: Menu
  dinner: Menu
}

type Food = string[]
type Nutrition = string[] | null

type HTML = string

const NOT_EXISTS = ''
const enum MENU {
  BREAKFAST = '조식',
  LUNCH = '중식',
  DINNER = '석식'
}

export class LunchVue {
  private static instance: LunchVue
  
  public static getInstance() {
    if (!this.instance) {
      this.instance = new LunchVue()
    }

    return new LunchVue()
  }

  private readonly domainList = this.initialiseDomainList()

  private get payload(): request.CoreOptions {
    return {
      rejectUnauthorized: false, // for unable to verify the first certificate in nodejs, reject unauthorized is needed
      gzip: true,
      json: true,
      headers: {
        'User-Agent': 'lunchvue-request-bot'
      }
    }
  }

  public async fetch(domain: string, code: string, month: number): Promise<any> {
    const uri = `http://${ domain }/sts_sci_md00_001.do?schulCode=${ code }&schulCrseScCode=4&ay=${ new Date().getFullYear() }&mm=${ ('0' + month).substr(-2) }`
    const payload: request.CoreOptions & request.UriOptions = { ...this.payload, uri }

    const response = await this.request(payload)
    const data: any[] = this.getMeals(response)

    return data
  }

  public async find(school: string): Promise<Spread[][]> {
    const query = encodeURIComponent(school)
    const payload = this.payload

    const requestList = this.domainList.map(async (domain): Promise<Spread[]> => {
      const uri = `http://${ domain }/spr_ccm_cm01_100.do?kraOrgNm=${ query }`
      const payload: request.CoreOptions & request.UriOptions = { ...this.payload, uri }

      const response = await this.request(payload)
      const data: any[] = response.resultSVO.orgDVOList
      const spreadList: Spread[] = data.map((spread): Spread => {
        const {
          kraOrgNm: name,
          orgCode: code,
          schulCrseScCodeNm: type,
          zipAdres: address
        } = spread

        return { name, code, type, address, domain }
      })

      return spreadList
    })

    const resultList = await Promise.all(requestList)
      .then((result: Spread[][]) =>
        result.filter((data): boolean => (!!data.length))
      )

    return resultList
  }

  private initialiseDomainList(): string[] {
    const PREFIX = 'stu'
    const SUFFIX = 'go.kr'
    const domainList: Domain[] = [
      { name: 'sen' }, // 서울특별시
      { name: 'pen' }, // 부산광역시
      { name: 'dge' }, // 대구광역시
      { name: 'ice' }, // 인천광역시
      { name: 'gen' }, // 광주광역시
      { name: 'dje' }, // 대전광역시
      { name: 'use' }, // 울산광역시
      { name: 'sje' }, // 세종특별자치시
      { name: 'goe' }, // 경기도
      { name: 'gwe' }, // 강원도
      { name: 'cbe' }, // 충청북도
      { name: 'cne' }, // 충청남도
      { name: 'jbe' }, // 전라북도
      { name: 'jne' }, // 전라남도
      { name: 'gbe', ltd: 'kr' }, // 경상북도
      { name: 'gne' }, // 경상남도
      { name: 'jje' } // 제주도
    ]

    return domainList.map(({ name, ltd }): string => [PREFIX, name, (ltd) || SUFFIX].join('.'))
  }

  private request(payload: request.CoreOptions & (request.UriOptions | request.UrlOptions)): Promise<any> {
    return new Promise((resolve, reject): void => {
      request(payload, (error, _, body) => (error) ? reject(error) : resolve(body))
    })
  }

  private getMeals(body: HTML): MenuTable {
    const pureElement = this.normalizationHTML(body)

    return pureElement.map((value: string, index: number) => {
      const menuTable: NOT_EXISTS | DailyMenu = value === NOT_EXISTS
        ? NOT_EXISTS
        : this.getDayMenu(value)
      
      return menuTable
    })
    .filter((value: any) => !!value)
  }

  private normalizationHTML(body: string) {
    // 영양소 성분이 없는 식단도 줄 바꿈을 해 주기 위해서
    // <br> 엘리먼트가 필터링되기 전에 대체(replace)합니다.
    //
    // 임시로 영양소 성분처럼 HACKED 합니다.
    // TODO. 나중에 수정해야 합니다.
    const breakToken = '1.'
    const $ = cheerio.load(body.replace(/<br\s*[\/]?>/gi, breakToken), {
      xmlMode: true
    })

    const separateElement = 'tbody tr td'
    const divisionalExpression = /\s+/
    return $(separateElement).map(function(index, element) {
      return $(this).text().replace(divisionalExpression, NOT_EXISTS)
    }).get()
    .filter((value) => value !== ' ')
  }

  private getDayMenu(value: string): DailyMenu {
    return {
      breakfast: this.extractMenu(MENU.BREAKFAST, value),
      lunch: this.extractMenu(MENU.LUNCH, value),
      dinner: this.extractMenu(MENU.DINNER, value)
    }
  }

  private extractMenu(menu: MENU, value: string): Menu {
    const pattern = new RegExp(`(\\[${ menu }\\])(.+?)(?=\\[)`)

    // hack for pattern-matching
    const __value = value + '['
    const __menu = __value.match(pattern)

    return (__menu)
      ? this.separateMenu(__menu[2])
      : NOT_EXISTS
  }

  private separateMenu(menu: string): Menu {
    return {
      food: menu
        .split(/\d{1,2}\./g)
        .filter((value) => !!value),
      nutrition: menu
        .match(/(\d{1,2}\.)+/g)
    }
  }
}
