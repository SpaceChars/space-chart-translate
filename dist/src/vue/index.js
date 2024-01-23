"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../core/index");
var TranslateVuePlugin = (function () {
    function TranslateVuePlugin(options) {
        this.engine = new index_1.TranslateEngine(options);
    }
    TranslateVuePlugin.prototype.translateVUE2 = function () {
    };
    TranslateVuePlugin.prototype.translateVUE3 = function () {
    };
    return TranslateVuePlugin;
}());
exports.default = {
    install: function (app, options) {
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
