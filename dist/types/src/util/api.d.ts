export declare enum HttpClientRequestMethod {
    GET = "get",
    POST = "post"
}
export interface HttpClientRequestDefaultOption {
    timeout?: number;
}
export interface HttpClientRequestOption extends HttpClientRequestDefaultOption {
    url?: string;
    method?: HttpClientRequestMethod | string;
    headers?: {
        [name: string]: string;
    };
    params?: any;
    data?: any;
    agent?: any;
}
export interface HtptClientResponseError {
    message?: string;
    code?: number | string;
}
export interface HtptClientResponseOption<T> extends HtptClientResponseError {
    data?: T;
}
interface IHttpClient {
    get<T>(url: string, params?: any, options?: HttpClientRequestOption): Promise<HtptClientResponseOption<T>>;
    post<T>(url: string, data?: any, options?: HttpClientRequestOption): Promise<HtptClientResponseOption<T>>;
    request<T>(options: HttpClientRequestOption): Promise<HtptClientResponseOption<T>>;
}
export declare class HttpClientInstance implements IHttpClient {
    private defaultOption;
    constructor(options: HttpClientRequestOption);
    get<T>(url: string, params?: any, options?: HttpClientRequestOption | undefined): Promise<HtptClientResponseOption<T>>;
    post<T>(url: string, data?: any, options?: HttpClientRequestOption | undefined): Promise<HtptClientResponseOption<T>>;
    request<T>(options: HttpClientRequestOption): Promise<HtptClientResponseOption<T>>;
}
export declare class HttpClient {
    create(options: HttpClientRequestDefaultOption): HttpClientInstance;
}
declare const _default: HttpClient;
export default _default;
