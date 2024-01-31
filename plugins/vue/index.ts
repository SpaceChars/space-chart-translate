import { LanguageMapItemInfo, TranslateConfigOption, TranslateEngineInstance } from '../../lib/core/engine';
import { PluginDefaultConfiguraOption } from '../index';

/**
 * translation queue item options
 */
interface TranslationQueueItemOption {
  text: string
  src?: string
  target?: string
  languageMap?: { [name: string]: Array<LanguageMapItemInfo> },
  translate: boolean
  request?: boolean
  el: HTMLElement
}

interface TranslateRequestQueueItemOption {
  src: TranslationQueueItemOption
  encodeText: string
}

/**
 * translation queue
 */

class TranslationQueue {
  private _queue: Array<TranslationQueueItemOption> = [];
  private _engine: TranslateEngineInstance;
  private _timer: NodeJS.Timeout | null = null;

  constructor(engine: TranslateEngineInstance) {
    this._engine = engine
  }

  /**
   * added translation queue item
   * @param options one or more queue options
   * @returns 
   */
  add(...options: Array<TranslationQueueItemOption>) {
    this._queue.push(...options)

    if (this._timer != null) clearTimeout(this._timer);
    this._timer = setTimeout(() => {
      this.request()
    }, 200)
  }

  request() {

    const requestList: Array<TranslateConfigOption> = []

    const requestQueue: Array<TranslateRequestQueueItemOption> = this._queue.map((info, i1) => {

      info.request = true;

      let _t = info.text;

      [...info.text.matchAll(/>(.*?)</g)].reduce((addIndex, rex: any, i2) => {

        const id = `{${i1}_${i2}}`,

          startIndex = addIndex + (rex.index || 0) + 1,
          endIndex = rex[1].length + startIndex;

        _t = _t.substring(0, startIndex) + id + _t.substring(endIndex, _t.length)

        requestList.push({
          id: `${i1}_${i2}`,
          text: rex[1],
          src: info.src || '',
          target: info.target || '',
          languageMap: info.languageMap
        })

        return addIndex - (rex[1].length - id.length)
      }, 0)

      return {
        src: info,
        encodeText: _t,
      }

    })

    this._engine.branchTranslate(requestList).then(res => {

      console.log('----res', res);


      res.forEach(info => {
        const ids = (info.id as string).split('_');
        requestQueue[Number(ids[0])].encodeText = requestQueue[Number(ids[0])].encodeText.replace(`{${info.id}}`, info.data)
      })

      requestQueue.forEach(info => {
        info.src.el.innerHTML = info.encodeText
      })


      // this._queue.forEach((info, index) => {
      //   info.el.innerHTML = (res.find(item => item.id == index) || {}).data || ''
      // })
    })
  }

  /**
   * By node element remove queue items 
   * Only remove queues with element  `request` option set to false or undefined
   * @param el node element
   */
  remove(el: HTMLElement | Node) {
    this._queue = (this._queue || []).filter(info => info.el == el && !info.request)
  }
}

let queue: TranslationQueue;

class TranslateVuePlugin {

  private _engine: TranslateEngineInstance

  constructor(options: PluginDefaultConfiguraOption) {
    if (!options.engine) {
      throw new Error('The translation engine connot be emptry')
    }

    this._engine = new TranslateEngineInstance(options.engine);
  }

  initQueue() {
    queue = new TranslationQueue(this._engine)
  }

  /**
   * registe `v-nottranslate` directive
   * @returns vue directive options
   */
  regsiteNotTranslateDirective() {
    return {

      /**
       * v2.0 指令绑定到元素时
       * @param el 
       * @param binding 
       * @param vnode 
       * @param prevVnode 
       */
      bind(el: HTMLElement, binding: any, vnode: any, prevVnode: any) {
        el.setAttribute('not-translate', 'true')
        queue.add({
          el,
          text: el.outerHTML,
          translate: false
        })
      },
      /**
       * v2.0 所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前
       * @param el 
       * @param binding 
       * @param vnode 
       * @param prevVnode 
       */
      update(el: HTMLElement, binding: any, vnode: any, prevVnode: any) {
        if (!el.getAttribute('not-translate')) {
          el.setAttribute('not-translate', 'true')
          queue.add({
            el,
            text: el.outerHTML,
            translate: false,
          })
        }
      },
      /**
       * v3.0 在绑定元素的父组,及他自己的所有子节点都挂载完成后调用
       * @param el 
       * @param binding 
       * @param vnode 
       * @param prevVnode 
       */
      mounted(el: HTMLElement, binding: any, vnode: any, prevVnode: any) {
        el.setAttribute('not-translate', 'true')
        queue.add({
          el,
          text: el.outerHTML,
          translate: false,
        })

      },
      /**
       * v3.0 在绑定元素的父组件,及他自己的所有子节点都更新后调用
       * @param el 
       * @param binding 
       * @param vnode 
       * @param prevVnode 
       */
      updated(el: HTMLElement, binding: any, vnode: any, prevVnode: any) {
        if (!el.getAttribute('not-translate')) {
          el.setAttribute('not-translate', 'true')
          queue.add({
            el,
            text: el.outerHTML,
            translate: false,
          })
        }
      },
    }
  }

  /**
   * registe `v-translate` directive
   * @returns vue directive options
   */
  retaiteTranslateDirective() {
    return {
      /**
       * [v2.0] 指令绑定到元素时
       * @param el 
       * @param binding 
       * @param vnode 
       * @param prevVnode 
       */
      bind: (el: HTMLElement, binding: any, vnode: any, prevVnode: any) => {
        queue.add({
          el,
          text: el.outerHTML,
          translate: true,
          ...(binding.value || {})
        })
      },
      /**
       * [v2.0] 子组件和组件都更新完成时
       * @param el 
       * @param binding 
       * @param vnode 
       * @param prevVnode 
       */
      componentUpdated: (el: HTMLElement, binding: any, vnode: any, prevVnode: any) => {
        queue.add({
          el,
          text: el.outerHTML,
          translate: true,
          ...(binding.value || {})
        })
      },
      /**
       * [v2.0] 指令与元素解绑时调用
       * @param el 
       */
      unbind: (el: HTMLElement) => {
        queue.remove(el)
      },
      /**
       * [v3.0] 在绑定元素的父组,及他自己的所有子节点都挂载完成后调用
       * @param el 
       * @param binding 
       * @param vnode 
       * @param prevVnode 
       */
      mounted: (el: HTMLElement, binding: any, vnode: any, prevVnode: any) => {
        queue.add({
          el,
          text: el.outerHTML,
          translate: true,
          ...(binding.value || {})
        })
      },
      /**
       * [v3.0] 在绑定元素的父组件,及他自己的所有子节点都更新后调用
       * @param el 
       * @param binding 
       * @param vnode 
       * @param prevVnode 
       */
      updated: (el: HTMLElement, binding: any, vnode: any, prevVnode: any) => {
        queue.add({
          el,
          text: el.outerHTML,
          translate: true,
          ...(binding.value || {})
        })
      },
      /**
       * [v3.0] 绑定元素的父组件卸载前调用
       * @param el 
       * @param binding 
       * @param vnode 
       * @param prevVnode 
       */
      beforeUnmount: (el: HTMLElement, binding: any, vnode: any, prevVnode: any) => {
        queue.remove(el)
      },
    }
  }

}


export default {
  install(app: any, options: PluginDefaultConfiguraOption) {

    const plugin = new TranslateVuePlugin(options)
    plugin.initQueue()

    app.directive('translate', plugin.retaiteTranslateDirective())
    app.directive('nottranslate', plugin.regsiteNotTranslateDirective())

  }
}