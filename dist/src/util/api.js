"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClient = exports.HttpClientInstance = exports.HttpClientRequestMethod = void 0;
var http = __importStar(require("stream-http"));
var buffer_1 = require("buffer");
var HttpClientRequestMethod;
(function (HttpClientRequestMethod) {
    HttpClientRequestMethod["GET"] = "get";
    HttpClientRequestMethod["POST"] = "post";
})(HttpClientRequestMethod || (exports.HttpClientRequestMethod = HttpClientRequestMethod = {}));
function send(options) {
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
        var _h = http.request(_options, function (res) {
            res.setEncoding('utf8');
            var _data;
            res.on('data', function (chunk) {
                if (!_data)
                    return _data = chunk;
                _data instanceof buffer_1.Buffer ? (_data.includes(chunk)) : (_data += chunk);
            });
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
        _h.on('error', function (e) {
            reject({
                message: e.message
            });
        });
        if (options.method == HttpClientRequestMethod.POST) {
            _h.write(JSON.stringify(options.data));
        }
        if (options.timeout > 0 || !Number.isInteger(options.timeout)) {
            _h.setTimeout(options.timeout || 60000, function () {
                reject({
                    message: 'time out'
                });
            });
        }
        _h.end();
    });
}
var HttpClientInstance = (function () {
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
        return send(Object.assign(this.defaultOption, options));
    };
    return HttpClientInstance;
}());
exports.HttpClientInstance = HttpClientInstance;
var HttpClient = (function () {
    function HttpClient() {
    }
    HttpClient.prototype.create = function (options) {
        return new HttpClientInstance(options);
    };
    return HttpClient;
}());
exports.HttpClient = HttpClient;
exports.default = new HttpClient();
