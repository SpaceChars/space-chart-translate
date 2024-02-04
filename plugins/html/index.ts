import { localMapItemInfo, TranslateConfigOption, TranslateDefaultConfiguraOption, TranslateEngineInstance } from "../../lib/core/engine";
import { PluginDefaultConfiguraOption } from "../index";

export interface HtmlPluginDefaultConfigOption extends PluginDefaultConfiguraOption {
  el: string
}

export class HtmlPlugin {
  private _engine: TranslateEngineInstance;
  private _el: HTMLElement

  private _options: HtmlPluginDefaultConfigOption

  constructor(options: HtmlPluginDefaultConfigOption) {
    this._options = options
    this._engine = new TranslateEngineInstance(options.engine)

    this._el = this.el
    this.watchDom()
  }

  get engine() {
    return this._engine
  }

  get options() {
    return this._options
  }

  get el() {
    return (document.querySelector(this._options.el) || document.querySelector('body')) as HTMLElement
  }

  watchDom() {
    if (this._el != document.querySelector('body')) {
      var observer = new MutationObserver(() => {
        this._el = this.el
      });
      observer.observe(document.querySelector('body') as Node, {
        childList: true
      });
    }
  }

  translate(options: TranslateDefaultConfiguraOption) {

    const textNodes: Array<any> = [];

    this._el.querySelectorAll('*').forEach(node => {
      node.childNodes.forEach(item => {
        if (item.nodeName == '#text' && node.getAttribute('not-translate') != 'not-translate') {
          textNodes.push(item)
        }
      })
    });

    const requestList: Array<TranslateConfigOption> = []

    textNodes.map((node, i) => {
      requestList.push({
        id: `${i}`,
        text: node.data,
        src: options.src || '',
        target: options.target || '',
        languageMap: options.languageMap
      })
    })

    return this._engine.branchTranslate(requestList).then(res => {
      res.forEach(info => {
        textNodes[Number(info.id)].textContent = info.data
      })
      return res
    })
  }
}

export default {
  create(options: HtmlPluginDefaultConfigOption) {
    const plugin = new HtmlPlugin(options)

    return plugin
  }
}