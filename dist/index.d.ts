/**
 * 默认翻译语言配置
 */
interface TranslateDefaultConfiguraOption {
    src?: string;
    target?: string;
    languageMap?: Array<localMapItemInfo>;
}
/**
 * 翻译配置
 */
interface TranslateConfigOption extends TranslateDefaultConfiguraOption {
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
    singleTranslate(options: TranslateConfigOption): Promise<TranslateResponseOption>;
    branchTranslate(options: Array<TranslateConfigOption>): Promise<Array<TranslateResponseOption>>;
}
declare class TranslateEngineInstance$1 implements ITranslateEngine {
    private _engine;
    constructor(enine: ITranslateEngine);
    singleTranslate(options: TranslateConfigOption): Promise<TranslateResponseOption>;
    branchTranslate(options: TranslateConfigOption[]): Promise<TranslateResponseOption[]>;
    translate(options: TranslateConfigOption | TranslateConfigOption[]): Promise<TranslateResponseOption> | Promise<TranslateResponseOption[]>;
}
/**
 * 语言词典库——单项词典信息
 */
interface localMapItemInfo {
    src: string;
    srcText: string;
    target: string;
    targetText: string;
    weight?: number;
}

interface PluginDefaultConfiguraOption {
    engine: ITranslateEngine;
}

interface HtmlPluginDefaultConfigOption extends PluginDefaultConfiguraOption {
    el: string;
}
declare class HtmlPlugin {
    private _engine;
    private _el;
    private _options;
    constructor(options: HtmlPluginDefaultConfigOption);
    get engine(): TranslateEngineInstance$1;
    get options(): HtmlPluginDefaultConfigOption;
    get el(): HTMLElement;
    watchDom(): void;
    translate(options: TranslateDefaultConfiguraOption): void;
}

interface VuePluginDefaultConfigOption extends HtmlPluginDefaultConfigOption {
    global?: boolean;
}
declare class VuePlugin {
    private _plugin;
    constructor(options: VuePluginDefaultConfigOption);
    translate(options: TranslateDefaultConfiguraOption): void;
}

declare enum DeeplxLanguage$1 {
    ZH = "ZH",
    EN = "EN"
}
interface DeeplxDefaultConfiguraOption extends TranslateDefaultConfiguraOption {
    url: string;
    authorization: string;
    timeout?: number;
}
declare class DeeplxTranslateEngine$1 implements ITranslateEngine {
    private src;
    private target;
    private languageMap;
    private url;
    private authorization;
    private http;
    constructor(options: DeeplxDefaultConfiguraOption);
    /**
     * 发送翻译请求
     * @param text 需要翻译的文本
     * @param src 源语言
     * @param target 目标语言
     * @returns
     */
    private requestTranslate;
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

declare const _default: {
    DeeplxTranslateEngine: typeof DeeplxTranslateEngine$1;
    DeeplxLanguage: typeof DeeplxLanguage$1;
    TranslateVuePlugin: {
        install(app: any, options: VuePluginDefaultConfigOption): void;
        create(options: VuePluginDefaultConfigOption): VuePlugin;
    };
    TranslateHTMLPlugin: {
        create(options: HtmlPluginDefaultConfigOption): HtmlPlugin;
    };
    TranslateEngineInstance: typeof TranslateEngineInstance$1;
};

declare const DeeplxTranslateEngine: typeof DeeplxTranslateEngine$1;
declare const DeeplxLanguage: typeof DeeplxLanguage$1;
declare const TranslateVuePlugin: {
    install(app: any, options: VuePluginDefaultConfigOption): void;
    create(options: VuePluginDefaultConfigOption): VuePlugin;
};
declare const TranslateEngineInstance: typeof TranslateEngineInstance$1;
declare const TranslateHTMLPlugin: {
    create(options: HtmlPluginDefaultConfigOption): HtmlPlugin;
};

export { DeeplxLanguage, DeeplxTranslateEngine, TranslateEngineInstance, TranslateHTMLPlugin, TranslateVuePlugin, _default as default };
//# sourceMappingURL=index.d.ts.map
