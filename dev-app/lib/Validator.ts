class Validator {
  /**
   * Bootstrap the validator.
   */
  public static bootstrap() {
    return new Validator()
  }

  /**
   * Returns {val} into a number, string, or false
   * 
   * @param val string to test.
   */
  public normalizePort(val: number | string | boolean): number | string | boolean {
    const port: any = (typeof val === 'string') ? parseInt(val, 10) : val

    if (isNaN(port)) {
      return val
    } else if (port >= 0) {
      return port
    } else {
      return false
    }
  }
}

export default Validator.bootstrap()