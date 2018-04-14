import { NextFunction, Request, Response, Router } from 'express'
import { BaseRoute } from './route';

import { default as LunchVue} from '../lib/LunchVue';


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
    console.log('[IndexRoute] Creating index route.')

    router.get('/', (req: Request, res: Response) => {
      new IndexRoute().index(req, res)
    })

    router.get('/find/:school', (req: Request, res: Response) => {
      new IndexRoute().find(req, res)
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
  public index(req: Request, res: Response) {
    let options: object = {
      'test': 'Test me XD!!'
    }

    this.render(req, res, 'index', options)
  }

  /**
   * Find some meals table in goverment, then return json
   * 
   * @class IndexRoute
   * @method find
   * @param req {Request} the express Request object.
   * @param res {Response} the express Response object.
   * @next {NextFunction} Execute the next method.
   */
  public find(req: Request, res: Response) {
    res.setHeader('Content-Type', 'application/json')
    res.json(LunchVue.request2(req.params.school))
  }
}
