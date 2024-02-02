
import { ITranslateEngine, localMapItemInfo, TranslateConfigOption, TranslateDefaultConfiguraOption, TranslateLocalMapping, TranslateResponseOption } from "../core/engine";

import { HttpClient, HttpClientInstance } from "../http/adapter";

export enum DeeplxLanguage {
  ZH = 'ZH',
  EN = 'EN'
}

export interface DeeplxDefaultConfiguraOption extends TranslateDefaultConfiguraOption {
  url: string
  authorization: string
  timeout?: number
}

export class DeeplxTranslateEngine implements ITranslateEngine {

  private src;
  private target;
  private languageMap;

  private url;
  private authorization;
  private http: HttpClientInstance;

  constructor(options: DeeplxDefaultConfiguraOption) {

    if (!options.url) {
      throw new Error('The deeplx translation address cannot be emptry')
    }

    if (!options.authorization) {
      throw new Error('The deeplx request token cannot be emptry')
    }


    this.src = options.src || DeeplxLanguage.ZH
    this.target = options.target || DeeplxLanguage.EN
    this.languageMap = options.languageMap

    this.url = options.url;
    this.authorization = options.authorization;
    this.http = HttpClient.create({
      timeout: options.timeout
    })
  }


  /**
   * 发送翻译请求
   * @param text 需要翻译的文本
   * @param src 源语言
   * @param target 目标语言
   * @returns 
   */
  private requestTranslate(text: string, src: DeeplxLanguage | string, target: DeeplxLanguage | string) {

    if (!src) {
      throw new Error('The source language cannot be emptry')
    }

    if (!target) {
      throw new Error('The target language cannot be emptry')
    }

    return this.http.post<TranslateResponseOption>(this.url,
      {
        "text": text,
        "source_lang": src || this.src,
        "target_lang": target || this.target
      }, {
      headers: {
        'Authorization': this.authorization
      }
    })
  }



  /**
   * 单个翻译
   * @param options 
   */
  singleTranslate(options: TranslateConfigOption): Promise<TranslateResponseOption> {
    return new Promise((resolve, reject) => {

      //是否是需要忽略翻译的文本
      const ignore = options.text == null || options.text == undefined || options.text.length <= 0 || !Number.isNaN(Number(options.text))
      if (ignore) {
        return resolve({
          alternatives: null,
          data: options.text || '',
          id: options.id,
          success: false
        })
      }

      const localMapControl = new TranslateLocalMapping((options.languageMap || this.languageMap || []) as Array<localMapItemInfo>)
      const _options = localMapControl.changeKey(options.src || this.src, options.target || this.target).encode(options)

      this.requestTranslate(_options.text || '', _options.src || '', _options.target || '').then((res) => {
        resolve(res.code == 200 && res.data?.data ? {
          alternatives: (res.data || {}).alternatives || null,
          data: localMapControl.decode(res.data?.data || ''),
          id: options.id || '',
          success: true
        } : {
          alternatives: null,
          data: options.text || '',
          id: options.id || '',
          success: false
        }
        )

      })
    })
  }

  /**
   * 批量翻译
   * @param options 
   */
  branchTranslate(options: Array<TranslateConfigOption>): Promise<Array<TranslateResponseOption>> {

    return new Promise((resolve, reject) => {

      const requestList: Array<TranslateResponseOption> = []

      Promise.all(options.map(info => this.singleTranslate(info))).then((res) => {
        requestList.push(...res)
      }).finally(() => {
        resolve(requestList)
      })

    })

  }


  /**
   * 
   * @param options Translation Configura Option
   * @returns If options dont instance of array,or options length is one return `Pormise<TranslateResponseOption>`,
   * otherwise return `Promise<Array<TranslateResponseOption>>` type
   * 
   */
  translate(options: TranslateConfigOption | Array<TranslateConfigOption>): Promise<TranslateResponseOption> | Promise<Array<TranslateResponseOption>> {
    return !(options instanceof Array) ? this.singleTranslate(options) : options.length == 1 ? this.singleTranslate(options[0]) : this.branchTranslate(options)
  }

}
