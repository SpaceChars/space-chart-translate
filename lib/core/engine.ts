
import HttpClient, { HtptClientResponseOption, HttpClientInstance } from '../http/adapter'

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
export interface TranslateDefaultConfiguraOption {
  src: string
  target: string
  languageMap?: { [name: string]: Array<LanguageMapItemInfo> }
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