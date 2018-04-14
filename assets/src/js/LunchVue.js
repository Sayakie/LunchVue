class LunchVue {
  constructor() {
    this.init()
  }

  /**
   * Bootstrap the LunchVue Application.
   * 
   * @class LunchVue
   * @method bootstrap
   */
  bootstrap() {
    return new LunchVue()
  }

  /**
   * Initial the application.
   * 
   * @class LunchVue
   * @method init
   */
  init() {
    console.log('init!')
    $.event.trigger('lunchvue-loaded')
  }
}

exports = LunchVue.bootstrap()