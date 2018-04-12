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
    console.log('[IndexRoute::Create] Creating index route.')

    router.get('/', (req: Request, res: Response, next: NextFunction) => {
      new IndexRoute().index(req, res, next)
    })

    router.get('/find/:school', (req: Request, res: Response, next: NextFunction) => {
      new IndexRoute().find(req, res, next)
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
  public find(req: Request, res: Response, next: NextFunction) {
    console.log(LunchVue.find('덕인'))
    res.json(JSON.stringify(LunchVue.find(req.params.school)))
  }
}