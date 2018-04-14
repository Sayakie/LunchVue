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
}
