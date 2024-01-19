"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("../src/core");
var index_1 = __importDefault(require("../index"));
var map = {
    'ZH-EN': [
        {
            src: '警告',
            target: '1'
        }
    ]
};
var translate = new index_1.default({
    src: core_1.TranslateLang.ZH,
    target: core_1.TranslateLang.EN,
    host: 'http://translate.cxjfun.top',
    langMap: map
});
translate.translate([
    {
        id: 1,
        text: "Warning: Permanently added the ECDSA host key for IP address '180.76.198.77' to the list of known hosts.git@gitee.com: Permission denied (publickey).!",
        src: core_1.TranslateLang.EN,
        target: core_1.TranslateLang.ZH
    },
    {
        id: 2,
        text: "警告：已将 IP 地址'180.76.198.77'的 ECDSA 主机密钥永久添加到已知 hosts.git@gitee.com 列表中：拒绝权限（公钥）！",
        src: core_1.TranslateLang.ZH,
        target: core_1.TranslateLang.EN
    }
]).then(function (res) {
    console.log('----res', JSON.stringify(res));
}).catch(function (error) {
    console.error(error);
});
