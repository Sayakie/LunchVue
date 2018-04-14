class Validator {
  /**
   * Bootstrap the validator
   */
  public static bootstrap() {
    return new Validator()
  }

  /**
   * Takes a {val} into a number, string or false
   * 
   * @param val string to test.
   */
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
   * Takes another function and wraps it in a promise
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

export default Validator.bootstrap()