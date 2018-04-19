type unNormalizedPort = number | string

type normalizedPort = number | string | boolean

export class Validator {
  private static instance: Validator

  public static getInstance() {
    if (!this.instance) {
      this.instance = new Validator()
    }

    return this.instance
  }

  public normalizePort(val: unNormalizedPort): normalizedPort {
    const port: number = (typeof val === 'string') ? parseInt(val, 10) : val

    if (isNaN(port)) {
      return val
    } else if (port >= 0) {
      return port
    } else {
      return false
    }
  }
}