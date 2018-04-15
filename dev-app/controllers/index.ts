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

    router.get('/test/:school', (req: Request, res: Response) => {
      new IndexRoute().test(req, res)
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
  public async find(req: Request, res: Response) {
    const list = await LunchVue.request2(req.params.school)

    res.send(list)
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
