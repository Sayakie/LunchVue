export class Validator {
  private static instance: Validator

  public static getInstance() {
    if (!this.instance) {
      this.instance = new Validator()
    }

    return this.instance
  }

  public normalizePort(val: number | string): number | string | boolean {
    const port: number = (typeof val === 'string') ? parseInt(val, 10) : val

    if (isNaN(port)) {
      return val
    } else if (port >= 0) {
      return port
    } else {
      return false
    }
  }
  
  /**
   * Takes another function and wraps it in a promise.
   * 
   * @class Validator
   * @method asyncMiddleware
   */
  public* asyncMiddleware(fn): any {
    (req, res, next) => {
      Promise.resolve(fn(req, res, next))
        .catch(next)
    }
  }
}
