import { TranslateEngine, TranslateConfigDefaultOption, TranslateLang } from '../core/index';

class TranslateVuePlugin {

  private engine: TranslateEngine

  constructor(options: TranslateConfigDefaultOption) {
    this.engine = new TranslateEngine(options)
  }

  translateVUE2() {

  }

  translateVUE3() {

  }

}


export default {
  install(app:any, options: TranslateConfigDefaultOption) {

    const plugin = new TranslateVuePlugin(options)

    const version = Number(app.version.split('.')[0])
    if (version < 3) {
      app.prototype.$translate = plugin.translateVUE2
    } else {
      app.config.globalProperties.$translate = plugin.translateVUE3
    }
  }
}