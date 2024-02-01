// @spacechart/translate  v1.0.1 Copyright (c) 2024 2388160949@qq.com and contributors
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
class TranslateLocalMapping {
    constructor(list) {
        this._currentKey = '';
        this._currentMap = [];
        this._mapList = list;
        this._map = this.initMap();
    }
    initMap() {
        const map = {};
        this._mapList.forEach(item => {
            const key = this.getMappingKey(item.src, item.target);
            const info = map[key] || [];
            info.push(item);
            map[key] = info;
        });
        return map;
    }
    get currentMapKey() {
        return this._currentKey;
    }
    /**
     * 获取映射key
     * @param src 源语言
     * @param target 目标语言
     * @returns
     */
    getMappingKey(src, target) {
        if (!src) {
            throw new Error('The mapping items srcource language connot be emptry!');
        }
        if (!target) {
            throw new Error('The mapping items target language connot be emptry!');
        }
        return `${src}_${target}`;
    }
    changeKey(src, target) {
        return this.buildTargetMappingInfo(this.getMappingKey(src, target));
    }
    /**
     * 根据key构建本地映射表
     * @param key 映射标识 需要符合`getMapingKey`返回格式
     * @returns
     */
    buildTargetMappingInfo(key) {
        const map = (this._map[key] || []).sort((v1, v2) => {
            const width1 = v1.weight == undefined ? 0 : v1.weight;
            const width2 = v2.weight == undefined ? 0 : v2.weight;
            return width2 - width1;
        });
        this._currentKey = key;
        this._currentMap = map;
        return this;
    }
    /**
     * 根据本地语言映射表标记原始文本
     * @param localLanguageMapInfo
     * @param info
     * @returns
     */
    encode(info, map) {
        info = JSON.parse(JSON.stringify(info));
        let text = info.text || '';
        (map || this._currentMap).forEach((map, index) => {
            text = text.replace(map.srcText, '${' + index + '}');
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
    decode(responseText, map) {
        (map || this._currentMap).forEach((item, index) => {
            responseText = responseText.replace('${' + index + '}', item.targetText);
        });
        return responseText;
    }
}

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
     * 发送翻译请求
     * @param text 需要翻译的文本
     * @param src 源语言
     * @param target 目标语言
     * @returns
     */
    requestTranslate(text, src, target) {
        if (!src) {
            throw new Error('The source language cannot be emptry');
        }
        if (!target) {
            throw new Error('The target language cannot be emptry');
        }
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
     * 单个翻译
     * @param options
     */
    singleTranslate(options) {
        return new Promise((resolve, reject) => {
            //是否是需要忽略翻译的文本
            const ignore = options.text == null || options.text == undefined || options.text.length <= 0 || !Number.isNaN(Number(options.text));
            if (ignore) {
                return resolve({
                    alternatives: null,
                    data: options.text || '',
                    id: options.id,
                    success: false
                });
            }
            const localMapControl = new TranslateLocalMapping((options.languageMap || this.languageMap || []));
            const _options = localMapControl.changeKey(options.src || this.src, options.target || this.target).encode(options);
            this.requestTranslate(_options.text || '', _options.src || '', _options.target || '').then((res) => {
                var _a, _b;
                resolve(res.code == 200 && ((_a = res.data) === null || _a === void 0 ? void 0 : _a.data) ? {
                    alternatives: (res.data || {}).alternatives || null,
                    data: localMapControl.decode(((_b = res.data) === null || _b === void 0 ? void 0 : _b.data) || ''),
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
            const requestList = [];
            Promise.all(options.map(info => this.singleTranslate(info))).then((res) => {
                requestList.push(...res);
            }).finally(() => {
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

class HtmlPlugin {
    constructor(options) {
        this._options = options;
        this._engine = new TranslateEngineInstance(options.engine);
        this._el = this.el;
        this.watchDom();
    }
    get engine() {
        return this._engine;
    }
    get options() {
        return this._options;
    }
    get el() {
        return (document.querySelector(this._options.el) || document.querySelector('body'));
    }
    watchDom() {
        if (this._el != document.querySelector('body')) {
            var observer = new MutationObserver(() => {
                this._el = this.el;
            });
            observer.observe(document.querySelector('body'), {
                childList: true
            });
        }
    }
    translate(options) {
        const textNodes = [];
        this._el.querySelectorAll('*').forEach(node => {
            node.childNodes.forEach(item => {
                if (item.nodeName == '#text' && node.getAttribute('not-translate') != 'not-translate') {
                    textNodes.push(item);
                }
            });
        });
        const requestList = [];
        textNodes.map((node, i) => {
            requestList.push({
                id: `${i}`,
                text: node.data,
                src: options.src || '',
                target: options.target || '',
                languageMap: options.languageMap
            });
        });
        this._engine.branchTranslate(requestList).then(res => {
            res.forEach(info => {
                textNodes[Number(info.id)].textContent = info.data;
            });
        });
    }
}
const TranslateHTMLPlugin = {
    create(options) {
        const plugin = new HtmlPlugin(options);
        return plugin;
    }
};

class VuePlugin {
    constructor(options) {
        this._plugin = TranslateHTMLPlugin.create(options);
    }
    translate(options) {
        this._plugin.translate(options);
    }
}
function getDirectiveOptions() {
    function setNotTranslateKey(el) {
        el.setAttribute('not-translate', 'not-translate');
        el.querySelectorAll('*').forEach(node => {
            if (node.getAttribute('not-translate') != 'not-translate') {
                node.setAttribute('not-translate', 'not-translate');
            }
        });
    }
    return {
        //v 2.0
        bind(el) {
            setNotTranslateKey(el);
        },
        //v2.0
        componentUpdated(el) {
            setNotTranslateKey(el);
        }
    };
}
const TranslateVuePlugin = {
    install(app, options) {
        const _p = this.create(options);
        if (options.global != false) {
            if (Number(app.version.split('.')[0]) < 3) {
                app.prototype.$t = _p;
            }
            else {
                app.config.globalProperties.$t = _p;
            }
        }
        app.directive('not-translate', getDirectiveOptions());
    },
    create(options) {
        return new VuePlugin(options);
    }
};

// this module should only have a default export
const translate = {
    DeeplxTranslateEngine,
    DeeplxLanguage,
    TranslateVuePlugin,
    TranslateHTMLPlugin,
    TranslateEngineInstance
};

module.exports = translate;
//# sourceMappingURL=translate.cjs.map
