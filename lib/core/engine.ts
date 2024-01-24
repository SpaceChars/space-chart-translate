
import HttpClient, { HtptClientResponseOption, HttpClientInstance } from '../http/adapter'

/**
 * 翻译语言
 */
export enum TranslateLang {
  ZH = 'ZH',
  EN = 'EN',
}

/**
 * 语言词典库——单项词典信息
 */
export interface LangMapItemInfo {
  src: string
  target: string
  weight?: number
}

/**
 * 默认翻译语言配置
 */
export interface TranslateConfigLangDefaultOption {
  src: TranslateLang | string
  target: TranslateLang | string
  langMap?: { [name: TranslateLang | string]: Array<LangMapItemInfo> }
}

export interface TranslateConfigDefaultOption extends TranslateConfigLangDefaultOption {
  host: string
  timeout?: number
}

/**
 * 翻译配置
 */
export interface TranslateConfigOption extends TranslateConfigLangDefaultOption {
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
  translate(options: TranslateConfigOption | Array<TranslateConfigOption>): Promise<Array<HtptClientResponseOption<TranslateResponseOption>>>;
}

/**
 * 翻译引擎
 */
export class TranslateEngine implements ITranslateEngine {

  private src;
  private target;
  private langMap;

  private host;
  private http: HttpClientInstance;

  constructor(options: TranslateConfigDefaultOption) {

    if (!options.host) {
      throw new Error('The deeplx host address cannot be emptry')
    }

    this.src = options.src || TranslateLang.ZH
    this.target = options.target || TranslateLang.EN
    this.langMap = options.langMap || {}

    this.host = options.host;
    this.http = HttpClient.create({
      timeout: options.timeout
    })
  }

  /**
   * 映射本地语言表
   * @param targetLang 
   * @param info 
   * @returns 
   */
  translateMapping(targetLangMapInfo: Array<LangMapItemInfo>, info: TranslateConfigOption): TranslateConfigOption {

    //深拷贝，避免数据影响
    info = JSON.parse(JSON.stringify(info));

    let text = info.text || '';
    targetLangMapInfo.forEach((map, index) => {
      text = text.replace(map.src, '${' + index + '}')
    })
    info.text = text;

    return info;
  }


  /**
   * 翻译
   * @param options 
   * @returns 
   */
  translate(options: TranslateConfigOption | Array<TranslateConfigOption>) {

    if (!(options instanceof Array)) {
      options = [options]
    }

    // 按源语言和目标语言进行分组
    const translateGroup: { [name: string]: Array<TranslateConfigOption> } = {};
    options.forEach((option, index) => {

      const key = `${option.src || this.src}-${option.target || this.target}`;
      const info: Array<TranslateConfigOption> = translateGroup[key] || [];
      info.push(option)
      translateGroup[key] = info;

    })

    //按照翻译分组分别进行翻译
    return Promise.all(Object.keys(translateGroup).map(key => {

      const lang = key.split('-');

      //获取目标语言中的本地语言映射表，并根据
      const targetLangMapInfo = (this.langMap[key] || []).sort((v1, v2) => {
        const width1 = v1.weight == undefined ? 0 : v1.weight
        const width2 = v2.weight == undefined ? 0 : v2.weight
        return width2 - width1;
      })

      //标记后的数据
      const group = translateGroup[key].map(item => this.translateMapping(targetLangMapInfo, item))

      let translateSrcText = JSON.stringify(group.map(item => item.text));

      return this.http.post<TranslateResponseOption>(this.host + '/translate',
        {
          "text": translateSrcText,
          "source_lang": lang[0],
          "target_lang": lang[1]
        }, {
        headers: {
          'Authorization': 'Bearer deeplx'
        }
      }).then((res) => {

        if (res.code == 200) {
          //如果翻译成功，则替换对应目标变量

          res.data = JSON.parse(res.data?.data || '[]').map((v: string, i: number) => {
            const info = group[i];
            targetLangMapInfo.forEach((item, index) => {
              v = v.replace('${' + index + '}', item.target)
            })
            return {
              alternatives: (res.data || {}).alternatives || null,
              data: v,
              id: info.id,
              success: true
            }
          })
        } else {
          // 如果翻译失败，则返回原数据
          res.data = translateGroup[key].map(info => {
            return {
              alternatives: null,
              data: info.text,
              id: info.id,
              success: false
            }
          }) as any
        }

        return res
      })
    }))


  }

}

export default TranslateEngine