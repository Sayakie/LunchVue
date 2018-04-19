import { createServer, Server } from 'http'

import * as path from 'path'
import * as express from 'express'
import * as compression from 'compression'
import * as logger from 'morgan'
import * as bodyParser from 'body-parser'
import * as dotenv from 'dotenv'

import { Validator } from './lib/Validator'
import { Route } from './route';

dotenv.config({ path: '.env' })

interface IError {
  status?: number
}

class App {
  private static instance: App

  public static getInstance(): App {
    if (!this.instance) {
      this.instance = new App()
    }

    return this.instance
  }

  private readonly express = express()
  private readonly server = createServer(this.express)
  private readonly port = Validator.getInstance().normalizePort(process.env.PORT || 3000)

  public start(): void {
    this.listen()
  }

  private constructor() {
    this.configuration()
    this.createRoutes()
  }

  private configuration(): void {
    // cache for 24 hours
    const HOUR = 1000 * 60 * 60
    const EXPIRE = (process.env.NODE_ENV === 'development') ? 0 : 24 * HOUR

    this.express.disable('x-powered-by')
    this.express.set('views', path.join(__dirname, '../views'))
    this.express.set('view engine', 'pug')
    this.express.use(compression())
    this.express.use(logger('dev'))
    this.express.use(bodyParser.json())
    this.express.use(bodyParser.urlencoded({ extended: false }))
    this.express.use('/assets', express.static(path.join(__dirname, '../assets/dist'), { maxAge: EXPIRE }))
    this.express.use('/assets', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/js'), { maxAge: EXPIRE }))
    this.express.use('/assets', express.static(path.join(__dirname, '../node_modules/jquery/dist'), { maxAge: EXPIRE }))
    this.express.use('/', express.static(path.join(__dirname, '../assets/public'), { maxAge: EXPIRE }))

    // Catch 404 and forward to error handler
    this.express.use((error: IError, _req: express.Request, _res: express.Response, next: express.NextFunction) => {
      error.status = 404
      next(error)
    })
  }

  private createRoutes(): void {
    const router: express.Router = express.Router()

    Route.getInstance().attach(router)
    this.express.use(router)
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log(`[Server] Successfully Listening on ${ this.port }`)
    })
    this.server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.syscall !== 'listen') {
        throw error
      }

      // Handle specific listen errors with friendly messages
      const portPrefixed = (typeof this.port === 'string')
        ? `Pipe ${ this.port }`
        : `Port ${ this.port }`

      switch (error.code) {
        case 'EACCES':
          console.error(`[Server] Permission denied. Requires elevated privileges`)
          process.exit(1)
          break
        case 'EADDRINUSE':
          console.error(`[Server] ${ portPrefixed } is already in use`)
          process.exit(1)
          break
        default:
          throw error
      }
    })
  }
}

export default App
