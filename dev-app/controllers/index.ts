import { NextFunction, Request, Response, Router } from 'express'
import { BaseRoute } from './route';

import LunchVue from '../lib/LunchVue';


/**
 * Route
 * 
 * @class Index
 */
export class IndexRoute extends BaseRoute {
  /**
   * Constructor
   * 
   * @class IndexRoute
   * @constructor
   */
  constructor() {
    super()
  }

  /**
   * Creates the routes.
   * 
   * @class IndexRoute
   * @method create
   * @static
   */
  public static create(router: Router) {
    console.log('[IndexRoute::Create] Creating index route.')

    router.get('/', (req: Request, res: Response, next: NextFunction) => {
      new IndexRoute().index(req, res, next)
    })

    router.get('/test', (req: Request, res: Response, next: NextFunction) => {
      new IndexRoute().join(req, res, next)
    })
  }

  /**
   * The home page route.
   * 
   * @class IndexRoute
   * @method index
   * @param req {Request} the express Request object.
   * @param res {Response} the express Response object.
   * @next {NextFunction} Execute the next method.
   */
  public index(req: Request, res: Response, next: NextFunction) {
    let options: object = {
      'test': 'Test me XD!!'
    }

    this.render(req, res, 'index', options)
  }

  /**
   * Test page route.
   * 
   * @class IndexRoute
   * @method join
   * @param req {Request} the express Request object.
   * @param res {Response} the express Response object.
   * @next {NextFunction} Execute the next method.
   */
  public join(req: Request, res: Response, next: NextFunction) {
    let options: object = {
      'data': LunchVue.find('덕인')
    }

    this.render(req, res, 'join', options)
  }
}