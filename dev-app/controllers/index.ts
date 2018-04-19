import { NextFunction, Request, Response, Router } from 'express'

import { LunchVue } from '../lib/LunchVue'
import { Page } from './_Page'

export class Controllers {
  private static instance: Controllers

  public static getInstance (): Controllers {
    if (!this.instance) {
      this.instance = new Controllers()
    }

    return this.instance
  }

  private readonly page = Page.getInstance()
  private readonly lunchVue = LunchVue.getInstance()

  public index(req: Request, res: Response): void {
    const payload: object = {
      test: 'Test me XD!!'
    }

    this.page.render(req, res, 'index', payload)
  }

  public async find(req: Request, res: Response): Promise<void> {
    const { school } = req.params
    const list = await this.lunchVue.find(school)

    res.send(list)
  }

  /**
   * Find some meals table in goverment, then return json
   * 
   * @class IndexRoute
   * @method get
   * @param req {Request} the express Request object.
   * @param res {Response} the express Response object.
   * @next {NextFunction} Execute the next method.
   */
  public async fetch(req: Request, res: Response): Promise<void> {
    const domain = req.body.domain
    const code = req.body.code
    const month = !!req.body.month ? req.body.month : new Date().getMonth() + 1
    const data = await this.lunchVue.fetch(domain, code, month)

    res.json(data)
  }

  /**
   * Test for ajax
   * 
   * @class IndexRoute
   * @method test
   * @param req {Request} the express Request object.
   * @param res {Response} the express Response object.
   */
  test(req: Request, res: Response) {
    res.json([[{"name":"대구덕인초등학교병설유치원","code":"D100000484","type":"유치원","address":"대구광역시 달서구 본리동"},{"name":"대구덕인초등학교","code":"D100000423","type":"초등학교","address":"대구광역시 달서구 본리동"}],[{"name":"덕인초등학교","code":"J100005395","type":"초등학교","address":"경기도 안산시 단원구 와동 1~400"}],[{"name":"목포덕인중학교","code":"Q100000827","type":"중학교","address":"전라남도 목포시 죽교동 1~93"},{"name":"목포덕인고등학교","code":"Q100000199","type":"고등학교","address":"전라남도 목포시 죽교동 1~93"}]])
  }
}
