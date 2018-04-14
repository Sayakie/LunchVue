import { Router, Request, Response } from 'express'

import { Controllers } from '../controllers'

export class Route {
  private static instance: Route

  public static getInstance (): Route {
    if (!this.instance) {
      this.instance = new Route()
    }

    return this.instance
  }

  private readonly indexRoute = Controllers.getInstance()

  public attach (router: Router): void {
    console.log('[Route] attach index route.')

    router.get('/', (req: Request, res: Response): void => this.indexRoute.index(req, res))
    router.get('/find/:school', (req: Request, res: Response): Promise<void> => this.indexRoute.find(req, res))
  }
}
