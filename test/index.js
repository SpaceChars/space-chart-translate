// import { TranslateLang } from '../lib/core'
// import TranslateEngine from '../index'
// const map = {
//   'ZH-EN': [
//     {
//       src: '警告',
//       target: '1'
//     }
//   ]
// }
// const translate = new TranslateEngine({
//   src: TranslateLang.ZH,
//   target: TranslateLang.EN,
//   host: 'http://translate.cxjfun.top',
//   langMap: map
//   // timeout: 1000
// })
// translate.translate([
//   {
//     id: 1,
//     text: "Warning: Permanently added the ECDSA host key for IP address '180.76.198.77' to the list of known hosts.git@gitee.com: Permission denied (publickey).!",
//     src: TranslateLang.EN,
//     target: TranslateLang.ZH
//   },
//   {
//     id: 2,
//     text: "警告：已将 IP 地址'180.76.198.77'的 ECDSA 主机密钥永久添加到已知 hosts.git@gitee.com 列表中：拒绝权限（公钥）！",
//     src: TranslateLang.ZH,
//     target: TranslateLang.EN
//   }
// ]).then((res) => {
//   res.forEach(item => {
//     console.log('----res', item.data)
//   })
// }).catch((error) => {
//   console.error('---error', error)
// });
var a = 0;
a ??= 1;
console.log(a);
console.log("----xhr", typeof XMLHttpRequest !== "undefined");
