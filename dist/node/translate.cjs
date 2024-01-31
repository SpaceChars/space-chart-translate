// @spacechart/translate  v1.0.0 Copyright (c) 2024 2388160949@qq.com and contributors
'use strict';

const http = require('http');
const buffer = require('buffer');

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    const n = Object.create(null);
    if (e) {
        for (const k in e) {
            if (k !== 'default') {
                const d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        }
    }
    n["default"] = e;
    return Object.freeze(n);
}

const http__namespace = /*#__PURE__*/_interopNamespace(http);

class NodeHttpAdapter {
    send(options) {
        return new Promise((resolve, reject) => {
            if (!options.url) {
                return reject({
                    mesage: 'The request url is empty'
                });
            }
            if (!options.method) {
                return reject({
                    mesage: 'The request method is empty'
                });
            }
            const urlInfo = new URL(URL.canParse(options.url) ? options.url : window.location.origin + options.url);
            const _options = Object.assign(options, {
                hostname: urlInfo.hostname || window.location.hostname,
                port: urlInfo.port || 80,
                path: urlInfo.pathname + urlInfo.search || '',
            });
            delete _options.url;
            //创建请求示例
            const _h = http__namespace.request(_options, (res) => {
                //设置响应编码
                res.setEncoding('utf8');
                //监听数据响应
                let _data;
                res.on('data', (chunk) => {
                    if (!_data)
                        return _data = chunk;
                    _data instanceof buffer.Buffer ? (_data.includes(chunk)) : (_data += chunk);
                });
                //监听响应结束
                res.on('end', () => {
                    if ((res.headers['content-type'] || '').indexOf('application/json') >= 0)
                        _data = JSON.parse(_data.toString() || '');
                    resolve({
                        code: res.statusCode || 500,
                        message: res.statusMessage,
                        data: _data
                    });
                });
            });
            //错误拦截
            _h.on('error', (e) => {
                reject({
                    message: e.message
                });
            });
            //添加内容到body
            if (options.method == HttpClientRequestMethod.POST) {
                _h.write(JSON.stringify(options.data));
            }
            //设置超时时间
            if (!Number.isInteger(options.timeout) || Number(options.timeout) > 0) {
                _h.setTimeout(options.timeout || 60000, () => {
                    reject({
                        message: 'time out'
                    });
                });
            }
            //结束写入
            _h.end();
        });
    }
}

/**
 * 请求方法
 */
var HttpClientRequestMethod;
(function (HttpClientRequestMethod) {
    HttpClientRequestMethod["GET"] = "GET";
    HttpClientRequestMethod["POST"] = "POST";
})(HttpClientRequestMethod || (HttpClientRequestMethod = {}));
class HttpClientInstance {
    constructor(options) {
        this.defaultOption = options;
    }
    get(url, params, options) {
        return this.request(Object.assign(this.defaultOption, options, { url, method: HttpClientRequestMethod.GET, params }));
    }
    post(url, data, options) {
        return this.request(Object.assign(this.defaultOption, options, { url, method: HttpClientRequestMethod.POST, data }));
    }
    request(options) {
        // const adapter = typeof XMLHttpRequest !== 'undefined' ? new XHRAdapter() : new NodeHttpAdapter();
        const adapter = new NodeHttpAdapter();
        return adapter.send(Object.assign(this.defaultOption, options));
    }
}
class HttpClient {
    static create(options) {
        return new HttpClientInstance(options);
    }
}

var DeeplxLanguage;
(function (DeeplxLanguage) {
    DeeplxLanguage["ZH"] = "ZH";
    DeeplxLanguage["EN"] = "EN";
})(DeeplxLanguage || (DeeplxLanguage = {}));
class DeeplxTranslateEngine {
    constructor(options) {
        if (!options.url) {
            throw new Error('The deeplx translation address cannot be emptry');
        }
        if (!options.authorization) {
            throw new Error('The deeplx request token cannot be emptry');
        }
        if (!options.src) {
            throw new Error('The source language cannot be emptry');
        }
        if (!options.target) {
            throw new Error('The target language cannot be emptry');
        }
        this.src = options.src || DeeplxLanguage.ZH;
        this.target = options.target || DeeplxLanguage.EN;
        this.languageMap = options.languageMap || {};
        this.url = options.url;
        this.authorization = options.authorization;
        this.http = HttpClient.create({
            timeout: options.timeout
        });
    }
    /**
     * 根据配置信息获取本地语言映射表映射标识
     * @param options 配置信息
     * @returns
     */
    getLocalTranslateLanguageMapKeyByOption(options) {
        return `${options.src || this.src}-${options.target || this.target}`;
    }
    /**
     * 根据key获取本地语言映射表信息
     * @param key 映射标识 格式：[srcource language]-[target language]
     * @returns
     */
    getLocalTranslateLanguageMapInfoByKey(key) {
        return (this.languageMap[key] || []).sort((v1, v2) => {
            const width1 = v1.weight == undefined ? 0 : v1.weight;
            const width2 = v2.weight == undefined ? 0 : v2.weight;
            return width2 - width1;
        });
    }
    /**
     * 发送翻译请求
     * @param text 需要翻译的文本
     * @param src 源语言
     * @param target 目标语言
     * @returns
     */
    requestTranslate(text, src, target) {
        return this.http.post(this.url, {
            "text": text,
            "source_lang": src || this.src,
            "target_lang": target || this.target
        }, {
            headers: {
                'Authorization': this.authorization
            }
        });
    }
    /**
     * 根据本地语言映射表标记原始文本
     * @param localLanguageMapInfo
     * @param info
     * @returns
     */
    encodeTranslateMapping(localLanguageMapInfo, info) {
        info = JSON.parse(JSON.stringify(info));
        let text = info.text || '';
        localLanguageMapInfo.forEach((map, index) => {
            text = text.replace(map.src, '${' + index + '}');
        });
        info.text = text;
        return info;
    }
    /**
     * 根据本地语言映射表解析翻译结果
     * @param key 映射标识
     * @param responseText 翻译响应结果文本
     * @returns
     */
    decodeTranslateMapping(localLanguageMapInfo, responseText) {
        localLanguageMapInfo.forEach((item, index) => {
            responseText = responseText.replace('${' + index + '}', item.target);
        });
        return responseText;
    }
    /**
     * 单个翻译
     * @param options
     */
    singleTranslate(options) {
        return new Promise((resolve, reject) => {
            const targetLanguageMapInfo = this.getLocalTranslateLanguageMapInfoByKey(this.getLocalTranslateLanguageMapKeyByOption(options));
            const _options = this.encodeTranslateMapping(targetLanguageMapInfo, options);
            this.requestTranslate(_options.text || '', _options.src, _options.target).then((res) => {
                var _a;
                resolve(res.code == 200 ? {
                    alternatives: (res.data || {}).alternatives || null,
                    data: this.decodeTranslateMapping(targetLanguageMapInfo, ((_a = res.data) === null || _a === void 0 ? void 0 : _a.data) || ''),
                    id: options.id || '',
                    success: true
                } : {
                    alternatives: null,
                    data: options.text || '',
                    id: options.id || '',
                    success: false
                });
            });
        });
    }
    /**
     * 批量翻译
     * @param options
     */
    branchTranslate(options) {
        return new Promise((resolve, reject) => {
            // 按源语言和目标语言进行分组
            const translateGroup = {};
            options.forEach((option, index) => {
                const key = this.getLocalTranslateLanguageMapKeyByOption(option);
                const info = translateGroup[key] || [];
                info.push(option);
                translateGroup[key] = info;
            });
            const requestList = [];
            //By language group Translate
            Promise.all(Object.keys(translateGroup).map(key => {
                const language = key.split('-');
                const targetLanguageMapInfo = this.getLocalTranslateLanguageMapInfoByKey(key);
                const encodeTranslateInfo = translateGroup[key].map(item => this.encodeTranslateMapping(targetLanguageMapInfo, item));
                // let translateSrcText = JSON.stringify(encodeTranslateInfo.map(item => item.text));
                let translateSrcText = encodeTranslateInfo.map(item => item.text).join(',');
                return this.requestTranslate(translateSrcText, language[0], language[1]).then((res) => {
                    var _a;
                    //处理返回的字符串
                    let _resText = ((_a = res.data) === null || _a === void 0 ? void 0 : _a.data) || '';
                    // _resText = (_resText.match(/.*]/g) || [])[0] || '[]';
                    // _resText = _resText.replaceAll('/\"', '\\\"');
                    // _resText = _resText.replaceAll('=\"', '=\\\"');
                    // const data = JSON.parse(_resText)
                    const data = _resText.split(',');
                    if (res.code == 200 && data.length > 1) {
                        data.forEach((v, i) => {
                            const info = encodeTranslateInfo[i];
                            requestList.push({
                                alternatives: (res.data || {}).alternatives || null,
                                data: this.decodeTranslateMapping(targetLanguageMapInfo, v),
                                id: info.id,
                                success: true
                            });
                        });
                    }
                    else {
                        translateGroup[key].forEach(info => {
                            requestList.push({
                                alternatives: null,
                                data: info.text || '',
                                id: info.id,
                                success: false
                            });
                        });
                    }
                });
            })).finally(() => {
                resolve(requestList);
            });
        });
    }
    /**
     *
     * @param options Translation Configura Option
     * @returns If options dont instance of array,or options length is one return `Pormise<TranslateResponseOption>`,
     * otherwise return `Promise<Array<TranslateResponseOption>>` type
     *
     */
    translate(options) {
        return !(options instanceof Array) ? this.singleTranslate(options) : options.length == 1 ? this.singleTranslate(options[0]) : this.branchTranslate(options);
    }
}

class TranslateEngineInstance {
    constructor(enine) {
        this._engine = enine;
    }
    singleTranslate(options) {
        return this._engine.singleTranslate(options);
    }
    branchTranslate(options) {
        return this._engine.branchTranslate(options);
    }
    translate(options) {
        return this._engine.translate(options);
    }
}

/**
 * translation queue
 */
class TranslationQueue {
    constructor(engine) {
        this._queue = [];
        this._timer = null;
        this._engine = engine;
    }
    /**
     * added translation queue item
     * @param options one or more queue options
     * @returns
     */
    add(...options) {
        this._queue.push(...options);
        if (this._timer != null)
            clearTimeout(this._timer);
        this._timer = setTimeout(() => {
            this.request();
        }, 200);
    }
    request() {
        const requestList = [];
        const requestQueue = this._queue.map((info, i1) => {
            info.request = true;
            let _t = info.text;
            [...info.text.matchAll(/>(.*?)</g)].reduce((addIndex, rex, i2) => {
                const id = `{${i1}_${i2}}`, startIndex = addIndex + (rex.index || 0) + 1, endIndex = rex[1].length + startIndex;
                _t = _t.substring(0, startIndex) + id + _t.substring(endIndex, _t.length);
                requestList.push({
                    id: `${i1}_${i2}`,
                    text: rex[1],
                    src: info.src || '',
                    target: info.target || '',
                    languageMap: info.languageMap
                });
                return addIndex - (rex[1].length - id.length);
            }, 0);
            return {
                src: info,
                encodeText: _t,
            };
        });
        this._engine.branchTranslate(requestList).then(res => {
            console.log('----res', res);
            res.forEach(info => {
                const ids = info.id.split('_');
                requestQueue[Number(ids[0])].encodeText = requestQueue[Number(ids[0])].encodeText.replace(`{${info.id}}`, info.data);
            });
            requestQueue.forEach(info => {
                info.src.el.innerHTML = info.encodeText;
            });
            // this._queue.forEach((info, index) => {
            //   info.el.innerHTML = (res.find(item => item.id == index) || {}).data || ''
            // })
        });
    }
    /**
     * By node element remove queue items
     * Only remove queues with element  `request` option set to false or undefined
     * @param el node element
     */
    remove(el) {
        this._queue = (this._queue || []).filter(info => info.el == el && !info.request);
    }
}
let queue;
class TranslateVuePlugin {
    constructor(options) {
        if (!options.engine) {
            throw new Error('The translation engine connot be emptry');
        }
        this._engine = new TranslateEngineInstance(options.engine);
    }
    initQueue() {
        queue = new TranslationQueue(this._engine);
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
            bind(el, binding, vnode, prevVnode) {
                el.setAttribute('not-translate', 'true');
                queue.add({
                    el,
                    text: el.outerHTML,
                    translate: false
                });
            },
            /**
             * v2.0 所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前
             * @param el
             * @param binding
             * @param vnode
             * @param prevVnode
             */
            update(el, binding, vnode, prevVnode) {
                if (!el.getAttribute('not-translate')) {
                    el.setAttribute('not-translate', 'true');
                    queue.add({
                        el,
                        text: el.outerHTML,
                        translate: false,
                    });
                }
            },
            /**
             * v3.0 在绑定元素的父组,及他自己的所有子节点都挂载完成后调用
             * @param el
             * @param binding
             * @param vnode
             * @param prevVnode
             */
            mounted(el, binding, vnode, prevVnode) {
                el.setAttribute('not-translate', 'true');
                queue.add({
                    el,
                    text: el.outerHTML,
                    translate: false,
                });
            },
            /**
             * v3.0 在绑定元素的父组件,及他自己的所有子节点都更新后调用
             * @param el
             * @param binding
             * @param vnode
             * @param prevVnode
             */
            updated(el, binding, vnode, prevVnode) {
                if (!el.getAttribute('not-translate')) {
                    el.setAttribute('not-translate', 'true');
                    queue.add({
                        el,
                        text: el.outerHTML,
                        translate: false,
                    });
                }
            },
        };
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
            bind: (el, binding, vnode, prevVnode) => {
                queue.add(Object.assign({ el, text: el.outerHTML, translate: true }, (binding.value || {})));
            },
            /**
             * [v2.0] 子组件和组件都更新完成时
             * @param el
             * @param binding
             * @param vnode
             * @param prevVnode
             */
            componentUpdated: (el, binding, vnode, prevVnode) => {
                queue.add(Object.assign({ el, text: el.outerHTML, translate: true }, (binding.value || {})));
            },
            /**
             * [v2.0] 指令与元素解绑时调用
             * @param el
             */
            unbind: (el) => {
                queue.remove(el);
            },
            /**
             * [v3.0] 在绑定元素的父组,及他自己的所有子节点都挂载完成后调用
             * @param el
             * @param binding
             * @param vnode
             * @param prevVnode
             */
            mounted: (el, binding, vnode, prevVnode) => {
                queue.add(Object.assign({ el, text: el.outerHTML, translate: true }, (binding.value || {})));
            },
            /**
             * [v3.0] 在绑定元素的父组件,及他自己的所有子节点都更新后调用
             * @param el
             * @param binding
             * @param vnode
             * @param prevVnode
             */
            updated: (el, binding, vnode, prevVnode) => {
                queue.add(Object.assign({ el, text: el.outerHTML, translate: true }, (binding.value || {})));
            },
            /**
             * [v3.0] 绑定元素的父组件卸载前调用
             * @param el
             * @param binding
             * @param vnode
             * @param prevVnode
             */
            beforeUnmount: (el, binding, vnode, prevVnode) => {
                queue.remove(el);
            },
        };
    }
}
const TranslateVuePlugin$1 = {
    install(app, options) {
        const plugin = new TranslateVuePlugin(options);
        plugin.initQueue();
        app.directive('translate', plugin.retaiteTranslateDirective());
        app.directive('nottranslate', plugin.regsiteNotTranslateDirective());
    }
};

// this module should only have a default export
const translate = {
    DeeplxTranslateEngine,
    DeeplxLanguage,
    TranslateVuePlugin: TranslateVuePlugin$1
};

module.exports = translate;
//# sourceMappingURL=translate.cjs.map
