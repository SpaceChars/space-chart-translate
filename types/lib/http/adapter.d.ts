import { HtptClientResponseOption, HttpClientRequestDefaultOption, HttpClientRequestOption } from './adapterType';
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
