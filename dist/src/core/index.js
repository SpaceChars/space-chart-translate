"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslateEngine = exports.TranslateLang = void 0;
var http_1 = __importDefault(require("../util/http"));
var TranslateLang;
(function (TranslateLang) {
    TranslateLang["ZH"] = "ZH";
    TranslateLang["EN"] = "EN";
})(TranslateLang || (exports.TranslateLang = TranslateLang = {}));
var TranslateEngine = (function () {
    function TranslateEngine(options) {
        if (!options.host) {
            throw new Error('The deeplx host address cannot be emptry');
        }
        this.src = options.src || TranslateLang.ZH;
        this.target = options.target || TranslateLang.EN;
        this.langMap = options.langMap || {};
        this.host = options.host;
        this.http = http_1.default.create({
            timeout: options.timeout
        });
    }
    TranslateEngine.prototype.translateMapping = function (targetLangMapInfo, info) {
        info = JSON.parse(JSON.stringify(info));
        var text = info.text || '';
        targetLangMapInfo.forEach(function (map, index) {
            text = text.replace(map.src, '${' + index + '}');
        });
        info.text = text;
        return info;
    };
    TranslateEngine.prototype.translate = function (options) {
        var _this = this;
        if (!(options instanceof Array)) {
            options = [options];
        }
        var translateGroup = {};
        options.forEach(function (option, index) {
            var key = "".concat(option.src || _this.src, "-").concat(option.target || _this.target);
            var info = translateGroup[key] || [];
            info.push(option);
            translateGroup[key] = info;
        });
        return Promise.all(Object.keys(translateGroup).map(function (key) {
            var lang = key.split('-');
            var targetLangMapInfo = (_this.langMap[key] || []).sort(function (v1, v2) {
                var width1 = v1.weight == undefined ? 0 : v1.weight;
                var width2 = v2.weight == undefined ? 0 : v2.weight;
                return width2 - width1;
            });
            console.log('------group-before', JSON.stringify(translateGroup[key]));
            var group = translateGroup[key].map(function (item) { return _this.translateMapping(targetLangMapInfo, item); });
            console.log('------group-after', JSON.stringify(group));
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
                console.log('---success', translateSrcText, JSON.stringify(group));
                if (res.code == 200) {
                    res.data = JSON.parse(res.data.data).map(function (v, i) {
                        var info = group[i];
                        targetLangMapInfo.forEach(function (item, index) {
                            v = v.replace('${' + index + '}', item.target);
                        });
                        return {
                            alternatives: res.data.alternatives,
                            data: v,
                            id: info.id
                        };
                    });
                }
                else {
                    res.data = translateGroup[key].map(function (info) {
                        return {
                            alternatives: null,
                            data: info.text,
                            id: info.id
                        };
                    });
                }
                return res;
            });
        }));
    };
    return TranslateEngine;
}());
exports.TranslateEngine = TranslateEngine;
