import { HtptClientResponseOption } from '../http/adapterType';
export declare enum TranslateLang {
    ZH = "ZH",
    EN = "EN"
}
export interface LangMapItemInfo {
    src: string;
    target: string;
    weight?: number;
}
export interface TranslateConfigLangDefaultOption {
    src: TranslateLang | string;
    target: TranslateLang | string;
    langMap?: {
        [name: TranslateLang | string]: Array<LangMapItemInfo>;
    };
}
export interface TranslateConfigDefaultOption extends TranslateConfigLangDefaultOption {
    host: string;
    timeout?: number;
}
export interface TranslateConfigOption extends TranslateConfigLangDefaultOption {
    text?: string;
    id: string | number;
}
export interface TranslateResponseOption {
    alternatives: Array<string> | null;
    data: string;
    id: string | number;
    success: Boolean;
}
export interface ITranslateEngine {
    translate(options: TranslateConfigOption | Array<TranslateConfigOption>): Promise<Array<HtptClientResponseOption<TranslateResponseOption>>>;
}
export default class TranslateEngine implements ITranslateEngine {
    private src;
    private target;
    private langMap;
    private host;
    private http;
    constructor(options: TranslateConfigDefaultOption);
    translateMapping(targetLangMapInfo: Array<LangMapItemInfo>, info: TranslateConfigOption): TranslateConfigOption;
    translate(options: TranslateConfigOption | Array<TranslateConfigOption>): Promise<HtptClientResponseOption<TranslateResponseOption>[]>;
}
