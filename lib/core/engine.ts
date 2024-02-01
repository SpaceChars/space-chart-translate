
import HttpClient, { HtptClientResponseOption, HttpClientInstance } from '../http/adapter'

/**
 * 默认翻译语言配置
 */
export interface TranslateDefaultConfiguraOption {
  src?: string
  target?: string
  languageMap?: Array<localMapItemInfo>
}

/**
 * 翻译配置
 */
export interface TranslateConfigOption extends TranslateDefaultConfiguraOption {
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
  singleTranslate(options: TranslateConfigOption): Promise<TranslateResponseOption>
  branchTranslate(options: Array<TranslateConfigOption>): Promise<Array<TranslateResponseOption>>
}

export class TranslateEngineInstance implements ITranslateEngine {
  private _engine: ITranslateEngine;

  constructor(enine: ITranslateEngine) {
    this._engine = enine
  }

  singleTranslate(options: TranslateConfigOption): Promise<TranslateResponseOption> {
    return this._engine.singleTranslate(options)
  }

  branchTranslate(options: TranslateConfigOption[]): Promise<TranslateResponseOption[]> {
    return this._engine.branchTranslate(options)
  }

  translate(options: TranslateConfigOption | TranslateConfigOption[]): Promise<TranslateResponseOption> | Promise<TranslateResponseOption[]> {
    return this._engine.translate(options)
  }

}

/**
 * 语言词典库——单项词典信息
 */
export interface localMapItemInfo {
  src: string
  srcText: string
  target: string
  targetText: string
  weight?: number
}

export class TranslateLocalMapping {

  private _mapList: Array<localMapItemInfo>
  private _map: { [name: string]: Array<localMapItemInfo> };

  private _currentKey: string = ''
  private _currentMap: Array<localMapItemInfo> = []

  constructor(list: Array<localMapItemInfo>) {
    this._mapList = list
    this._map = this.initMap()
  }

  private initMap() {
    const map: { [name: string]: Array<localMapItemInfo> } = {};

    this._mapList.forEach(item => {
      const key = this.getMappingKey(item.src, item.target);
      const info = map[key] || [];
      info.push(item);
      map[key] = info
    })
    return map
  }

  get currentMapKey() {
    return this._currentKey
  }


  /**
   * 获取映射key
   * @param src 源语言
   * @param target 目标语言
   * @returns 
   */
  getMappingKey(src: string, target: string) {
    if (!src) {
      throw new Error('The mapping items srcource language connot be emptry!')
    }

    if (!target) {
      throw new Error('The mapping items target language connot be emptry!')
    }

    return `${src}_${target}`
  }

  changeKey(src: string, target: string) {
    return this.buildTargetMappingInfo(this.getMappingKey(src, target))
  }

  /**
   * 根据key构建本地映射表
   * @param key 映射标识 需要符合`getMapingKey`返回格式
   * @returns 
   */
  buildTargetMappingInfo(key: string) {

    const map = (this._map[key] || []).sort((v1, v2) => {
      const width1 = v1.weight == undefined ? 0 : v1.weight
      const width2 = v2.weight == undefined ? 0 : v2.weight
      return width2 - width1;
    })

    this._currentKey = key
    this._currentMap = map
    return this;
  }

  /**
   * 根据本地语言映射表标记原始文本
   * @param localLanguageMapInfo 
   * @param info 
   * @returns 
   */
  encode(info: TranslateConfigOption, map?: Array<localMapItemInfo>): TranslateConfigOption {

    info = JSON.parse(JSON.stringify(info));
    let text = info.text || '';

    (map || this._currentMap).forEach((map, index) => {
      text = text.replace(map.srcText, '${' + index + '}')
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
  decode(responseText: string, map?: Array<localMapItemInfo>): string {
    (map || this._currentMap).forEach((item, index) => {
      responseText = responseText.replace('${' + index + '}', item.targetText)
    })
    return responseText;
  }



}

