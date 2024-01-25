import { TranslateEngine, TranslateConfigDefaultOption, TranslateLang } from '../../lib/core/engine';

class TranslateVuePlugin {

  private engine: TranslateEngine

  constructor(options: TranslateConfigDefaultOption) {
    this.engine = new TranslateEngine(options)
  }

  translateVUE2() {
    return {
      bind(el: HTMLElement, binding: any, vnode: any, prevVnode: any) {
        console.log('----vue2-bind', el, binding, vnode, prevVnode);
      },
      inserted() {

      },
      update() {

      },
      componentUpdated() {

      },
      unbind() {

      }
    }
  }

  translateVUE3() {
    return {
      // 在绑定元素的 attribute 前
      // 或事件监听器应用前调用
      created(el: any, binding: any, vnode: any, prevVnode: any) {
        // 下面会介绍各个参数的细节
      },
      // 在元素被插入到 DOM 前调用
      beforeMount(el: any, binding: any, vnode: any, prevVnode: any) { },
      // 在绑定元素的父组件
      // 及他自己的所有子节点都挂载完成后调用
      mounted(el: any, binding: any, vnode: any, prevVnode: any) { },
      // 绑定元素的父组件更新前调用
      beforeUpdate(el: any, binding: any, vnode: any, prevVnode: any) { },
      // 在绑定元素的父组件
      // 及他自己的所有子节点都更新后调用
      updated(el: any, binding: any, vnode: any, prevVnode: any) { },
      // 绑定元素的父组件卸载前调用
      beforeUnmount(el: any, binding: any, vnode: any, prevVnode: any) { },
      // 绑定元素的父组件卸载后调用
      unmounted(el: any, binding: any, vnode: any, prevVnode: any) { }
    }
  }

}


export default {
  install(app: any, options: TranslateConfigDefaultOption) {

    const plugin = new TranslateVuePlugin(options)

    const version = Number(app.version.split('.')[0])
    if (version < 3) {
      app.directive('translate', plugin.translateVUE2())
      app.prototype.$translate = plugin.translateVUE2
    } else {
      app.directive('translate', plugin.translateVUE3())
      app.config.globalProperties.$translate = plugin.translateVUE3
    }
  }
}