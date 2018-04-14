import * as request from 'request'

interface Domain {
  readonly name: string
  readonly ltd?: string
}

interface Spread {
  readonly name: string
  readonly code: string
  readonly type: string
  readonly address: string
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

  private get payload (): request.CoreOptions {
    return {
      rejectUnauthorized: false, // for unable to verify the first certificate in nodejs, reject unauthorized is needed
      gzip: true,
      json: true,
      headers: {
        'User-Agent': 'lunchvue-request-bot'
      }
    }
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

        return { name, code, type, address }
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

  private request (payload: request.CoreOptions & (request.UriOptions | request.UrlOptions)): Promise<any> {
    return new Promise((resolve, reject): void => {
      request(payload, (error, _, body) => (error) ? reject(error) : resolve(body))
    })
  }
}
