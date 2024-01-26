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

var XHRAdapter = /** @class */ (function () {
    function XHRAdapter() {
    }
    XHRAdapter.prototype.send = function (options) {
        return new Promise(function (resolve, reject) {
            reject({});
        });
    };
    return XHRAdapter;
}());

var NodeHttpAdapter = /** @class */ (function () {
    function NodeHttpAdapter() {
    }
    NodeHttpAdapter.prototype.send = function (options) {
        return new Promise(function (resolve, reject) {
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
            var urlInfo = new URL(options.url);
            var _options = Object.assign(options, {
                hostname: urlInfo.hostname || window.location.hostname || '127.0.0.1',
                port: urlInfo.port || 80,
                path: urlInfo.pathname + urlInfo.search || ''
            });
            delete _options.url;
            //创建请求示例
            var _h = http__namespace.request(_options, function (res) {
                //设置响应编码
                res.setEncoding('utf8');
                //监听数据响应
                var _data;
                res.on('data', function (chunk) {
                    if (!_data)
                        return _data = chunk;
                    _data instanceof buffer.Buffer ? (_data.includes(chunk)) : (_data += chunk);
                });
                //监听响应结束
                res.on('end', function () {
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
            _h.on('error', function (e) {
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
                _h.setTimeout(options.timeout || 60000, function () {
                    reject({
                        message: 'time out'
                    });
                });
            }
            //结束写入
            _h.end();
        });
    };
    return NodeHttpAdapter;
}());

/**
 * 请求方法
 */
var HttpClientRequestMethod;
(function (HttpClientRequestMethod) {
    HttpClientRequestMethod["GET"] = "get";
    HttpClientRequestMethod["POST"] = "post";
})(HttpClientRequestMethod || (HttpClientRequestMethod = {}));
var HttpClientInstance = /** @class */ (function () {
    function HttpClientInstance(options) {
        this.defaultOption = options;
    }
    HttpClientInstance.prototype.get = function (url, params, options) {
        return this.request(Object.assign(this.defaultOption, options, { url: url, method: HttpClientRequestMethod.GET, params: params }));
    };
    HttpClientInstance.prototype.post = function (url, data, options) {
        return this.request(Object.assign(this.defaultOption, options, { url: url, method: HttpClientRequestMethod.POST, data: data }));
    };
    HttpClientInstance.prototype.request = function (options) {
        var adapter = typeof XMLHttpRequest !== 'undefined' ? new XHRAdapter() : new NodeHttpAdapter();
        return adapter.send(Object.assign(this.defaultOption, options));
    };
    return HttpClientInstance;
}());
var HttpClient = /** @class */ (function () {
    function HttpClient() {
    }
    HttpClient.prototype.create = function (options) {
        return new HttpClientInstance(options);
    };
    return HttpClient;
}());
const HttpClient$1 = new HttpClient();

/**
 * 翻译语言
 */
var TranslationLanguage;
(function (TranslationLanguage) {
    TranslationLanguage["ZH"] = "ZH";
    TranslationLanguage["EN"] = "EN";
})(TranslationLanguage || (TranslationLanguage = {}));
/**
 * 翻译引擎
 */
var TranslateEngine = /** @class */ (function () {
    function TranslateEngine(options) {
        if (!options.host) {
            throw new Error('The deeplx host address cannot be emptry');
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
        this.src = options.src || TranslationLanguage.ZH;
        this.target = options.target || TranslationLanguage.EN;
        this.languageMap = options.languageMap || {};
        this.host = options.host;
        this.authorization = options.authorization;
        this.http = HttpClient$1.create({
            timeout: options.timeout
        });
    }
    /**
     * 根据配置信息获取本地语言映射表映射标识
     * @param options 配置信息
     * @returns
     */
    TranslateEngine.prototype.getLocalTranslateLanguageMapKeyByOption = function (options) {
        return "".concat(options.src || this.src, "-").concat(options.target || this.target);
    };
    /**
     * 根据key获取本地语言映射表信息
     * @param key 映射标识 格式：[srcource language]-[target language]
     * @returns
     */
    TranslateEngine.prototype.getLocalTranslateLanguageMapInfoByKey = function (key) {
        return (this.languageMap[key] || []).sort(function (v1, v2) {
            var width1 = v1.weight == undefined ? 0 : v1.weight;
            var width2 = v2.weight == undefined ? 0 : v2.weight;
            return width2 - width1;
        });
    };
    /**
     * 发送翻译请求
     * @param text 需要翻译的文本
     * @param src 源语言
     * @param target 目标语言
     * @returns
     */
    TranslateEngine.prototype.requestTranslate = function (text, src, target) {
        return this.http.post(this.host + '/translate', {
            "text": text,
            "source_language": src || this.src,
            "target_language": target || this.target
        }, {
            headers: {
                'Authorization': this.authorization
            }
        });
    };
    /**
     * 根据本地语言映射表标记原始文本
     * @param localLanguageMapInfo
     * @param info
     * @returns
     */
    TranslateEngine.prototype.encodeTranslateMapping = function (localLanguageMapInfo, info) {
        info = JSON.parse(JSON.stringify(info));
        var text = info.text || '';
        localLanguageMapInfo.forEach(function (map, index) {
            text = text.replace(map.src, '${' + index + '}');
        });
        info.text = text;
        return info;
    };
    /**
     * 根据本地语言映射表解析翻译结果
     * @param key 映射标识
     * @param responseText 翻译响应结果文本
     * @returns
     */
    TranslateEngine.prototype.decodeTranslateMapping = function (localLanguageMapInfo, responseText) {
        localLanguageMapInfo.forEach(function (item, index) {
            responseText = responseText.replace('${' + index + '}', item.target);
        });
        return responseText;
    };
    /**
     * 单个翻译
     * @param options
     */
    TranslateEngine.prototype.singleTranslate = function (options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var targetLanguageMapInfo = _this.getLocalTranslateLanguageMapInfoByKey(_this.getLocalTranslateLanguageMapKeyByOption(options));
            var _options = _this.encodeTranslateMapping(targetLanguageMapInfo, options);
            _this.requestTranslate(_options.text || '', _options.src, _options.target).then(function (res) {
                var _a;
                resolve(res.code == 200 ? {
                    alternatives: (res.data || {}).alternatives || null,
                    data: _this.decodeTranslateMapping(targetLanguageMapInfo, ((_a = res.data) === null || _a === void 0 ? void 0 : _a.data) || ''),
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
    };
    /**
     * 批量翻译
     * @param options
     */
    TranslateEngine.prototype.branchTranslate = function (options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // 按源语言和目标语言进行分组
            var translateGroup = {};
            options.forEach(function (option, index) {
                var key = _this.getLocalTranslateLanguageMapKeyByOption(option);
                var info = translateGroup[key] || [];
                info.push(option);
                translateGroup[key] = info;
            });
            //By language group Translate
            Promise.all(Object.keys(translateGroup).map(function (key) {
                var language = key.split('-');
                var targetLanguageMapInfo = _this.getLocalTranslateLanguageMapInfoByKey(key);
                var encodeTranslateInfo = translateGroup[key].map(function (item) { return _this.encodeTranslateMapping(targetLanguageMapInfo, item); });
                var translateSrcText = JSON.stringify(encodeTranslateInfo.map(function (item) { return item.text; }));
                _this.requestTranslate(translateSrcText, language[0], language[1]).then(function (res) {
                    var _a;
                    if (res.code == 200) {
                        resolve(JSON.parse(((_a = res.data) === null || _a === void 0 ? void 0 : _a.data) || '[]').map(function (v, i) {
                            var info = encodeTranslateInfo[i];
                            return {
                                alternatives: (res.data || {}).alternatives || null,
                                data: _this.decodeTranslateMapping(targetLanguageMapInfo, v),
                                id: info.id,
                                success: true
                            };
                        }));
                    }
                    else {
                        resolve(translateGroup[key].map(function (info) {
                            return {
                                alternatives: null,
                                data: info.text || '',
                                id: info.id,
                                success: false
                            };
                        }));
                    }
                });
            }));
        });
    };
    /**
     *
     * @param options Translation Configura Option
     * @returns If options dont instance of array,or options length is one return `Pormise<TranslateResponseOption>`,
     * otherwise return `Promise<Array<TranslateResponseOption>>` type
     *
     */
    TranslateEngine.prototype.translate = function (options) {
        return !(options instanceof Array) ? this.singleTranslate(options) : options.length == 1 ? this.singleTranslate(options[0]) : this.branchTranslate(options);
    };
    return TranslateEngine;
}());

var TranslateVuePlugin = /** @class */ (function () {
    function TranslateVuePlugin(options) {
        this.engine = new TranslateEngine(options);
    }
    TranslateVuePlugin.prototype.translateVUE2 = function () {
        return {
            bind: function (el, binding, vnode, prevVnode) {
                console.log('----vue2-bind', el, binding, vnode, prevVnode);
            },
            inserted: function () {
            },
            update: function () {
            },
            componentUpdated: function (el, binding, vnode, prevVnode) {
                console.log('----vue2-componentUpdated', el, binding, vnode, prevVnode);
            },
            unbind: function () {
            }
        };
    };
    TranslateVuePlugin.prototype.translateVUE3 = function () {
        return {
            // 在绑定元素的 attribute 前
            // 或事件监听器应用前调用
            created: function (el, binding, vnode, prevVnode) {
                // 下面会介绍各个参数的细节
            },
            // 在元素被插入到 DOM 前调用
            beforeMount: function (el, binding, vnode, prevVnode) { },
            // 在绑定元素的父组件
            // 及他自己的所有子节点都挂载完成后调用
            mounted: function (el, binding, vnode, prevVnode) { },
            // 绑定元素的父组件更新前调用
            beforeUpdate: function (el, binding, vnode, prevVnode) { },
            // 在绑定元素的父组件
            // 及他自己的所有子节点都更新后调用
            updated: function (el, binding, vnode, prevVnode) { },
            // 绑定元素的父组件卸载前调用
            beforeUnmount: function (el, binding, vnode, prevVnode) { },
            // 绑定元素的父组件卸载后调用
            unmounted: function (el, binding, vnode, prevVnode) { }
        };
    };
    return TranslateVuePlugin;
}());
const TranslateVuePlugin$1 = {
    install: function (app, options) {
        var plugin = new TranslateVuePlugin(options);
        var version = Number(app.version.split('.')[0]);
        if (version < 3) {
            app.directive('translate', plugin.translateVUE2());
            app.prototype.$translate = plugin.translateVUE2;
        }
        else {
            app.directive('translate', plugin.translateVUE3());
            app.config.globalProperties.$translate = plugin.translateVUE3;
        }
    }
};

var Translate = {
    TranslateEngine: TranslateEngine,
    TranslateVuePlugin: TranslateVuePlugin$1,
    TranslationLanguage: TranslationLanguage
};

module.exports = Translate;
//# sourceMappingURL=translate.cjs.map
