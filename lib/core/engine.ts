
import HttpClient, { HtptClientResponseOption, HttpClientInstance } from '../http/adapter'

/**
 * 翻译语言
 */
export enum TranslationLanguage {
  ZH = 'ZH',
  EN = 'EN',
}

/**
 * 语言词典库——单项词典信息
 */
export interface LanguageMapItemInfo {
  src: string
  target: string
  weight?: number
}

/**
 * 默认翻译语言配置
 */
export interface TranslateConfigLanguageDefaultOption {
  src: TranslationLanguage | string
  target: TranslationLanguage | string
  languageMap?: { [name: TranslationLanguage | string]: Array<LanguageMapItemInfo> }
}

export interface TranslateConfigDefaultOption extends TranslateConfigLanguageDefaultOption {
  host: string
  authorization: string
  timeout?: number
}

/**
 * 翻译配置
 */
export interface TranslateConfigOption extends TranslateConfigLanguageDefaultOption {
  text?: string
  id: string | number
}

/**
 * 翻译响应信息
 */
export interface TranslateResponseOption {
  alternatives: Array<string> | null
  data: string
  id: string | number
  success: Boolean
}

/**
 * 翻译引擎接口类
 */
export interface ITranslateEngine {
  translate(options: TranslateConfigOption | Array<TranslateConfigOption>): Promise<TranslateResponseOption> | Promise<Array<TranslateResponseOption>>;
}

/**
 * 翻译引擎
 */
export class TranslateEngine implements ITranslateEngine {

  private src;
  private target;
  private languageMap;

  private host;
  private authorization;
  private http: HttpClientInstance;

  constructor(options: TranslateConfigDefaultOption) {

    if (!options.host) {
      throw new Error('The deeplx host address cannot be emptry')
    }

    if (!options.authorization) {
      throw new Error('The deeplx request token cannot be emptry')
    }

    if (!options.src) {
      throw new Error('The source language cannot be emptry')
    }

    if (!options.target) {
      throw new Error('The target language cannot be emptry')
    }

    this.src = options.src || TranslationLanguage.ZH
    this.target = options.target || TranslationLanguage.EN
    this.languageMap = options.languageMap || {}

    this.host = options.host;
    this.authorization = options.authorization;
    this.http = HttpClient.create({
      timeout: options.timeout
    })
  }

  /**
   * 根据配置信息获取本地语言映射表映射标识
   * @param options 配置信息
   * @returns 
   */
  private getLocalTranslateLanguageMapKeyByOption(options: TranslateConfigOption): string {
    return `${options.src || this.src}-${options.target || this.target}`;
  }

  /**
   * 根据key获取本地语言映射表信息
   * @param key 映射标识 格式：[srcource language]-[target language]
   * @returns 
   */
  private getLocalTranslateLanguageMapInfoByKey(key: string): Array<LanguageMapItemInfo> {
    return (this.languageMap[key] || []).sort((v1, v2) => {
      const width1 = v1.weight == undefined ? 0 : v1.weight
      const width2 = v2.weight == undefined ? 0 : v2.weight
      return width2 - width1;
    })
  }

  /**
   * 发送翻译请求
   * @param text 需要翻译的文本
   * @param src 源语言
   * @param target 目标语言
   * @returns 
   */
  private requestTranslate(text: string, src: TranslationLanguage | string, target: TranslationLanguage | string) {
    return this.http.post<TranslateResponseOption>(this.host + '/translate',
      {
        "text": text,
        "source_language": src || this.src,
        "target_language": target || this.target
      }, {
      headers: {
        'Authorization': this.authorization
      }
    })
  }

  /**
   * 根据本地语言映射表标记原始文本
   * @param localLanguageMapInfo 
   * @param info 
   * @returns 
   */
  encodeTranslateMapping(localLanguageMapInfo: Array<LanguageMapItemInfo>, info: TranslateConfigOption): TranslateConfigOption {

    info = JSON.parse(JSON.stringify(info));
    let text = info.text || '';

    localLanguageMapInfo.forEach((map, index) => {
      text = text.replace(map.src, '${' + index + '}')
    })

    info.text = text;
    return info;
  }


  /**
   * 根据本地语言映射表解析翻译结果
   * @param key 映射标识
   * @param responseText 翻译响应结果文本
   * @returns 
   */
  decodeTranslateMapping(localLanguageMapInfo: Array<LanguageMapItemInfo>, responseText: string): string {
    localLanguageMapInfo.forEach((item, index) => {
      responseText = responseText.replace('${' + index + '}', item.target)
    })
    return responseText;
  }

  /**
   * 单个翻译
   * @param options 
   */
  singleTranslate(options: TranslateConfigOption): Promise<TranslateResponseOption> {
    return new Promise((resolve, reject) => {

      const targetLanguageMapInfo = this.getLocalTranslateLanguageMapInfoByKey(this.getLocalTranslateLanguageMapKeyByOption(options))

      const _options = this.encodeTranslateMapping(targetLanguageMapInfo, options)

      this.requestTranslate(_options.text || '', _options.src, _options.target).then((res) => {
        resolve(res.code == 200 ? {
          alternatives: (res.data || {}).alternatives || null,
          data: this.decodeTranslateMapping(targetLanguageMapInfo, res.data?.data || ''),
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

      // 按源语言和目标语言进行分组
      const translateGroup: { [name: string]: Array<TranslateConfigOption> } = {};

      options.forEach((option, index) => {

        const key = this.getLocalTranslateLanguageMapKeyByOption(option)

        const info: Array<TranslateConfigOption> = translateGroup[key] || [];
        info.push(option)

        translateGroup[key] = info;
      })

      //By language group Translate
      Promise.all(Object.keys(translateGroup).map(key => {

        const language = key.split('-');

        const targetLanguageMapInfo = this.getLocalTranslateLanguageMapInfoByKey(key)

        const encodeTranslateInfo = translateGroup[key].map(item => this.encodeTranslateMapping(targetLanguageMapInfo, item))

        let translateSrcText = JSON.stringify(encodeTranslateInfo.map(item => item.text));

        this.requestTranslate(translateSrcText, language[0], language[1]).then((res) => {

          if (res.code == 200) {

            resolve(JSON.parse(res.data?.data || '[]').map((v: string, i: number) => {
              const info = encodeTranslateInfo[i];
              return {
                alternatives: (res.data || {}).alternatives || null,
                data: this.decodeTranslateMapping(targetLanguageMapInfo, v),
                id: info.id,
                success: true
              }
            }))
          } else {
            resolve(translateGroup[key].map(info => {
              return {
                alternatives: null,
                data: info.text || '',
                id: info.id,
                success: false
              }
            })
            )
          }
        })
      }))
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

export default TranslateEngine