// @space-chart/translate  v1.0.0 Copyright (c) 2024 2388160949@qq.com and contributors
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
var TranslateLang;
(function (TranslateLang) {
    TranslateLang["ZH"] = "ZH";
    TranslateLang["EN"] = "EN";
})(TranslateLang || (TranslateLang = {}));
/**
 * 翻译引擎
 */
var TranslateEngine = /** @class */ (function () {
    function TranslateEngine(options) {
        if (!options.host) {
            throw new Error('The deeplx host address cannot be emptry');
        }
        this.src = options.src || TranslateLang.ZH;
        this.target = options.target || TranslateLang.EN;
        this.langMap = options.langMap || {};
        this.host = options.host;
        this.http = HttpClient$1.create({
            timeout: options.timeout
        });
    }
    /**
     * 映射本地语言表
     * @param targetLang
     * @param info
     * @returns
     */
    TranslateEngine.prototype.translateMapping = function (targetLangMapInfo, info) {
        //深拷贝，避免数据影响
        info = JSON.parse(JSON.stringify(info));
        var text = info.text || '';
        targetLangMapInfo.forEach(function (map, index) {
            text = text.replace(map.src, '${' + index + '}');
        });
        info.text = text;
        return info;
    };
    /**
     * 翻译
     * @param options
     * @returns
     */
    TranslateEngine.prototype.translate = function (options) {
        var _this = this;
        if (!(options instanceof Array)) {
            options = [options];
        }
        // 按源语言和目标语言进行分组
        var translateGroup = {};
        options.forEach(function (option, index) {
            var key = "".concat(option.src || _this.src, "-").concat(option.target || _this.target);
            var info = translateGroup[key] || [];
            info.push(option);
            translateGroup[key] = info;
        });
        //按照翻译分组分别进行翻译
        return Promise.all(Object.keys(translateGroup).map(function (key) {
            var lang = key.split('-');
            //获取目标语言中的本地语言映射表，并根据
            var targetLangMapInfo = (_this.langMap[key] || []).sort(function (v1, v2) {
                var width1 = v1.weight == undefined ? 0 : v1.weight;
                var width2 = v2.weight == undefined ? 0 : v2.weight;
                return width2 - width1;
            });
            //标记后的数据
            var group = translateGroup[key].map(function (item) { return _this.translateMapping(targetLangMapInfo, item); });
            var translateSrcText = JSON.stringify(group.map(function (item) { return item.text; }));
            return _this.http.post(_this.host + '/translate', {
                "text": translateSrcText,
                "source_lang": lang[0],
                "target_lang": lang[1]
            }, {
                headers: {
                    'Authorization': 'Bearer deeplx'
                }
            }).then(function (res) {
                var _a;
                if (res.code == 200) {
                    //如果翻译成功，则替换对应目标变量
                    res.data = JSON.parse(((_a = res.data) === null || _a === void 0 ? void 0 : _a.data) || '[]').map(function (v, i) {
                        var info = group[i];
                        targetLangMapInfo.forEach(function (item, index) {
                            v = v.replace('${' + index + '}', item.target);
                        });
                        return {
                            alternatives: (res.data || {}).alternatives || null,
                            data: v,
                            id: info.id,
                            success: true
                        };
                    });
                }
                else {
                    // 如果翻译失败，则返回原数据
                    res.data = translateGroup[key].map(function (info) {
                        return {
                            alternatives: null,
                            data: info.text,
                            id: info.id,
                            success: false
                        };
                    });
                }
                return res;
            });
        }));
    };
    return TranslateEngine;
}());

var TranslateVuePlugin = /** @class */ (function () {
    function TranslateVuePlugin(options) {
        this.engine = new TranslateEngine(options);
    }
    TranslateVuePlugin.prototype.translateVUE2 = function () {
    };
    TranslateVuePlugin.prototype.translateVUE3 = function () {
    };
    return TranslateVuePlugin;
}());
const TranslateVuePlugin$1 = {
    install: function (app, options) {
        console.log('----xhr', typeof XMLHttpRequest !== 'undefined');
        var plugin = new TranslateVuePlugin(options);
        var version = Number(app.version.split('.')[0]);
        if (version < 3) {
            app.prototype.$translate = plugin.translateVUE2;
        }
        else {
            app.config.globalProperties.$translate = plugin.translateVUE3;
        }
    }
};

var Translate = {
    TranslateEngine: TranslateEngine,
    TranslateVuePlugin: TranslateVuePlugin$1
};

module.exports = Translate;
//# sourceMappingURL=translate.cjs.map
