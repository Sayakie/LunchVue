import { NextFunction, Request, Response } from 'express'

export class Page {
    private static instance: Page
  
    public static getInstance(): Page {
      if (!this.instance) {
        this.instance = new Page()
      }
  
      return this.instance
    }
  
    private readonly scripts: string[] = []
  
    public addScript(script: string): Page {
      this.scripts.push(script)
  
      return this
    }
  
    public render(_req: Request, res: Response, pageName: string, payload?: any) {
      res.locals.BASE_URL = process.env.DOMAIN
      res.render(pageName, payload)
    }
  }