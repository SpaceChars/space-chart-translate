import { TranslateDefaultConfiguraOption, TranslateEngineInstance } from "../../lib/core/engine";
import TranslateHTMLPugin, { HtmlPlugin, HtmlPluginDefaultConfigOption } from "../html/index"

export interface VuePluginDefaultConfigOption extends HtmlPluginDefaultConfigOption {
  global?: boolean
}

export class VuePlugin {

  private _plugin: HtmlPlugin

  constructor(options: VuePluginDefaultConfigOption) {
    this._plugin = TranslateHTMLPugin.create(options)
  }

  translate(options: TranslateDefaultConfiguraOption) {
    this._plugin.translate(options)
  }
}

export function getDirectiveOptions() {

  function setNotTranslateKey(el: HTMLElement) {
    el.setAttribute('not-translate', 'not-translate')
    el.querySelectorAll('*').forEach(node => {
      if (node.getAttribute('not-translate') != 'not-translate') {
        node.setAttribute('not-translate', 'not-translate')
      }
    })
  }

  return {
    //v 2.0
    bind(el: HTMLElement) {
      setNotTranslateKey(el)
    },
    //v2.0
    componentUpdated(el: HTMLElement) {
      setNotTranslateKey(el)
    }
  }
}

export default {
  install(app: any, options: VuePluginDefaultConfigOption) {
    const _p = this.create(options);

    if (options.global != false) {
      if (Number(app.version.split('.')[0]) < 3) {
        app.prototype.$t = _p
      } else {
        app.config.globalProperties.$t = _p
      }
    }

    app.directive('not-translate', getDirectiveOptions())
  },
  create(options: VuePluginDefaultConfigOption) {
    return new VuePlugin(options)
  }
}