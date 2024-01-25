/**
 * 错误响应属性
 */
interface HtptClientResponseError {
    message?: string;
    code?: number | string;
}
/**
 * 正常响应属性
 */
interface HtptClientResponseOption<T> extends HtptClientResponseError {
    data: T | null;
}

/**
 * 翻译语言
 */
declare enum TranslateLang {
    ZH = "ZH",
    EN = "EN"
}
/**
 * 语言词典库——单项词典信息
 */
interface LangMapItemInfo {
    src: string;
    target: string;
    weight?: number;
}
/**
 * 默认翻译语言配置
 */
interface TranslateConfigLangDefaultOption {
    src: TranslateLang | string;
    target: TranslateLang | string;
    langMap?: {
        [name: TranslateLang | string]: Array<LangMapItemInfo>;
    };
}
interface TranslateConfigDefaultOption extends TranslateConfigLangDefaultOption {
    host: string;
    timeout?: number;
}
/**
 * 翻译配置
 */
interface TranslateConfigOption extends TranslateConfigLangDefaultOption {
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
    translate(options: TranslateConfigOption | Array<TranslateConfigOption>): Promise<Array<HtptClientResponseOption<TranslateResponseOption>>>;
}
/**
 * 翻译引擎
 */
declare class TranslateEngine$1 implements ITranslateEngine {
    private src;
    private target;
    private langMap;
    private host;
    private http;
    constructor(options: TranslateConfigDefaultOption);
    /**
     * 映射本地语言表
     * @param targetLang
     * @param info
     * @returns
     */
    translateMapping(targetLangMapInfo: Array<LangMapItemInfo>, info: TranslateConfigOption): TranslateConfigOption;
    /**
     * 翻译
     * @param options
     * @returns
     */
    translate(options: TranslateConfigOption | Array<TranslateConfigOption>): Promise<HtptClientResponseOption<TranslateResponseOption>[]>;
}

declare const Translate: {
    TranslateEngine: typeof TranslateEngine$1;
    TranslateVuePlugin: {
        install(app: any, options: TranslateConfigDefaultOption): void;
    };
};

declare const TranslateEngine: typeof TranslateEngine$1;
declare const TranslateVuePlugin: {
    install(app: any, options: TranslateConfigDefaultOption): void;
};

export { TranslateEngine, TranslateVuePlugin, Translate as default };
//# sourceMappingURL=index.d.ts.map
