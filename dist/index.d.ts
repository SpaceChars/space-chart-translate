/**
 * 翻译语言
 */
declare enum TranslationLanguage$1 {
    ZH = "ZH",
    EN = "EN"
}
/**
 * 语言词典库——单项词典信息
 */
interface LanguageMapItemInfo {
    src: string;
    target: string;
    weight?: number;
}
/**
 * 默认翻译语言配置
 */
interface TranslateConfigLanguageDefaultOption {
    src: TranslationLanguage$1 | string;
    target: TranslationLanguage$1 | string;
    languageMap?: {
        [name: TranslationLanguage | string]: Array<LanguageMapItemInfo>;
    };
}
interface TranslateConfigDefaultOption extends TranslateConfigLanguageDefaultOption {
    host: string;
    authorization: string;
    timeout?: number;
}
/**
 * 翻译配置
 */
interface TranslateConfigOption extends TranslateConfigLanguageDefaultOption {
    text?: string;
    id: string | number;
}
/**
 * 翻译响应信息
 */
interface TranslateResponseOption {
    alternatives: Array<string> | null;
    data: string;
    id: string | number;
    success: Boolean;
}
/**
 * 翻译引擎接口类
 */
interface ITranslateEngine {
    translate(options: TranslateConfigOption | Array<TranslateConfigOption>): Promise<TranslateResponseOption> | Promise<Array<TranslateResponseOption>>;
}
/**
 * 翻译引擎
 */
declare class TranslateEngine$1 implements ITranslateEngine {
    private src;
    private target;
    private languageMap;
    private host;
    private authorization;
    private http;
    constructor(options: TranslateConfigDefaultOption);
    /**
     * 根据配置信息获取本地语言映射表映射标识
     * @param options 配置信息
     * @returns
     */
    private getLocalTranslateLanguageMapKeyByOption;
    /**
     * 根据key获取本地语言映射表信息
     * @param key 映射标识 格式：[srcource language]-[target language]
     * @returns
     */
    private getLocalTranslateLanguageMapInfoByKey;
    /**
     * 发送翻译请求
     * @param text 需要翻译的文本
     * @param src 源语言
     * @param target 目标语言
     * @returns
     */
    private requestTranslate;
    /**
     * 根据本地语言映射表标记原始文本
     * @param localLanguageMapInfo
     * @param info
     * @returns
     */
    encodeTranslateMapping(localLanguageMapInfo: Array<LanguageMapItemInfo>, info: TranslateConfigOption): TranslateConfigOption;
    /**
     * 根据本地语言映射表解析翻译结果
     * @param key 映射标识
     * @param responseText 翻译响应结果文本
     * @returns
     */
    decodeTranslateMapping(localLanguageMapInfo: Array<LanguageMapItemInfo>, responseText: string): string;
    /**
     * 单个翻译
     * @param options
     */
    singleTranslate(options: TranslateConfigOption): Promise<TranslateResponseOption>;
    /**
     * 批量翻译
     * @param options
     */
    branchTranslate(options: Array<TranslateConfigOption>): Promise<Array<TranslateResponseOption>>;
    /**
     *
     * @param options Translation Configura Option
     * @returns If options dont instance of array,or options length is one return `Pormise<TranslateResponseOption>`,
     * otherwise return `Promise<Array<TranslateResponseOption>>` type
     *
     */
    translate(options: TranslateConfigOption | Array<TranslateConfigOption>): Promise<TranslateResponseOption> | Promise<Array<TranslateResponseOption>>;
}

declare const Translate: {
    TranslateEngine: typeof TranslateEngine$1;
    TranslateVuePlugin: {
        install(app: any, options: TranslateConfigDefaultOption): void;
    };
    TranslationLanguage: typeof TranslationLanguage$1;
};

declare const TranslateEngine: typeof TranslateEngine$1;
declare const TranslateVuePlugin: {
    install(app: any, options: TranslateConfigDefaultOption): void;
};
declare const TranslationLanguage: typeof TranslationLanguage$1;

export { TranslateEngine, TranslateVuePlugin, TranslationLanguage, Translate as default };
//# sourceMappingURL=index.d.ts.map