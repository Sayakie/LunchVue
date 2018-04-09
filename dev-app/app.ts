import { createServer, Server } from 'http'

import * as path from 'path'
import * as express from 'express'
import * as compression from 'compression'
import * as logger from 'morgan'
import * as bodyParser from 'body-parser'

import { default as Validator } from './lib/Validator'

class App {
  public static readonly PORT: number | string | boolean = Validator.normalizePort(process.env.PORT)
  private server: Server
  private express: express.Application
  // private io: SockerIO.Server
  private port: number | string | boolean

  /**
   * Set up the application. Assign variables to allow access to each framework, including Express.js and Socker.io Servers, and allow them to respond to the port. Also set the error handler to make debugging easier.
   * 
   * @constructor
   */
  constructor() {
    this.initialization()
    this.configuration()
    this.listen()
  }

  /**
   * Bootstrap the application.
   * 
   * @return {App}
   */
  public static bootstrap(): App {
    return new App()
  }

  /**
   * Initial the application.
   */
  private initialization(): void {
    this.express = express()
    this.server = createServer(this.express)
    // this.io = socketIO(this.server)
  }

  /**
   * Config the applicaiton.
   */
  private configuration(): void {
    this.port = App.PORT

    //
    // <!-- Express Territory -->
    this.express.disable('x-powered-by')
    this.express.set('views', path.join(__dirname, '../views'))
    this.express.set('view engine', 'hbs')
    this.express.use(compression())
    this.express.use(logger('dev'))
    this.express.use(bodyParser.json())
    this.express.use(bodyParser.urlencoded({ extended: false }))
    this.express.use('/assets', express.static(path.join(__dirname, '../assets/dist'), { maxAge: 31557600000 }))
    this.express.use('/', express.static(path.join(__dirname, '../assets/static'), { maxAge: 31557600000 }))
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      // Application is running successfully
    })
    this.server.on('error', (e: NodeJS.ErrnoException) => {
      if (e.syscall !== 'listen') {
        throw e
      }

      // Handle specific listen errors with friendly messages
      const bind = (typeof this.port === 'string') ? `Pipe ${this.port}` : `Port ${this.port}`
      switch (e.code) {
        case 'EACCES':
          console.error(`Permission denied`)
          process.exit(1)
          break
        case 'EADDRINUSE':
          console.error(`${bind} already in use`)
          process.exit(1)
          break
        default:
          throw e
      }
    })
  }
}

const app = App.bootstrap()
export default app