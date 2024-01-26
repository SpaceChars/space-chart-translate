
import { TranslateEngine, TranslationLanguage } from '../index'
import { TranslateResponseOption } from '../lib/core/engine';



const map = {
  'ZH-EN': [
    {
      src: '警告',
      target: '1'
    }
  ]
}

const translate = new TranslateEngine({
  src: TranslationLanguage.ZH,
  target: TranslationLanguage.EN,
  languageMap: map,
  host: 'http://translate.cxjfun.top',
  authorization: "Bearer deeplx"
})

translate.translate([
  {
    id: 1,
    text: "Warning: Permanently added the ECDSA host key for IP address '180.76.198.77' to the list of known hosts.git@gitee.com: Permission denied (publickey).!",
    src: TranslationLanguage.EN,
    target: TranslationLanguage.ZH
  },
  {
    id: 2,
    text: "警告：已将 IP 地址'180.76.198.77'的 ECDSA 主机密钥永久添加到已知 hosts.git@gitee.com 列表中：拒绝权限（公钥）！",
    src: TranslationLanguage.ZH,
    target: TranslationLanguage.EN
  }
]).then((res) => {
  (res as Array<TranslateResponseOption>).forEach(item => {
    console.log('----res', item.data)
  })
}).catch((error) => {
  console.error('---error', error)
});
