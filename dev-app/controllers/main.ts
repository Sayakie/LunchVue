import { NextFunction, Request, Response } from 'express'

export const index = (req: Request, res: Response) => {
  res.render('index', {
    title: req.httpVersion
  })
}