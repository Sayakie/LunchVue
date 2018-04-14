import { createServer, Server } from 'http'

import * as path from 'path'
import * as express from 'express'
import * as compression from 'compression'
import * as logger from 'morgan'
import * as bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env' })

import { default as Validator } from './lib/Validator'
import { IndexRoute } from './controllers/index';

interface IError {
  status?: number,
  data?: any
}

class App {
  public static readonly PORT: number | string | boolean = Validator.normalizePort(process.env.PORT || 3000)
  private server: Server
  private express: express.Application
  // private socket: SockerIO.Server
  private port: number | string | boolean

  /**
   * Set up the application. Assign variables to allow access to each framework,
   * including Express.js and Socker.io Servers, and allow them to respond to the port.
   * Also set the error handler to make debugging easier.
   * 
   * @class App
   * @constructor
   */
  constructor() {
    this.initialization()
    this.configuration()
    this.listen()
    this.routes()
  }

  /**
   * Bootstrap the application.
   * 
   * @class App
   * @method bootstrap
   * @static
   * @return {App} Returns the newly created injector for this server.
   */
  public static bootstrap(): App {
    return new App()
  }

  /**
   * Initial the application.
   * 
   * @class App
   * @method initialization
   */
  private initialization(): void {
    this.express = express()
    this.server = createServer(this.express)
    // this.socket = socketIO(this.server)
  }

  /**
   * Config the applicaiton.
   * 
   * @class App
   * @method configuration
   */
  private configuration(): void {
    const EXPIRE = (!process.env.NODE_ENV) ? 31557600000 : 0
    this.port = App.PORT

    this.express.disable('x-powered-by')
    this.express.set('views', path.join(__dirname, '../views'))
    this.express.set('view engine', 'pug')
    this.express.use(compression())
    this.express.use(logger('dev'))
    this.express.use(bodyParser.json())
    this.express.use(bodyParser.urlencoded({ extended: false }))
    this.express.use('/assets', express.static(path.join(__dirname, '../assets/dist'), { maxAge: EXPIRE }))
    this.express.use('/', express.static(path.join(__dirname, '../assets/public'), { maxAge: EXPIRE }))

    // Catch 404 and forward to error handler
    this.express.use((err: IError, req: express.Request, res: express.Response, next: express.NextFunction) => {
      err.status = 404
      next(err)
    })
  }

  /**
   * Gives 
   * 
   * @class App
   * @method listen
   */
  private listen(): void {
    this.server.listen(this.port, () => {
      console.log(`[Server] Successfully Listening on ${this.port}`)
    })
    this.server.on('error', (e: NodeJS.ErrnoException) => {
      if (e.syscall !== 'listen') {
        throw e
      }

      // Handle specific listen errors with friendly messages
      const bind = (typeof this.port === 'string') ? `Pipe ${this.port}` : `Port ${this.port}`
      switch (e.code) {
        case 'EACCES':
          console.error(`[Server] Permission denied. Requires elevated privileges`)
          process.exit(1)
          break
        case 'EADDRINUSE':
          console.error(`[Server] ${bind} is already in use`)
          process.exit(1)
          break
        default:
          throw e
      }
    })
  }

  /**
   * Create and return Router.
   * 
   * @class App
   * @method routes
   * @return void
   */
  private routes(): void {
    const router: express.Router = express.Router()

    IndexRoute.create(router)
    this.express.use(router)
  }
}

const app = App.bootstrap()
export default app
