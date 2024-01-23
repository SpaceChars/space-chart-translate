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
}
export interface HtptClientResponseError {
    message?: string;
    code?: number | string;
}
export interface HtptClientResponseOption<T> extends HtptClientResponseError {
    data: T | null;
}
export interface IHttpAdapter {
    send<T>(options: HttpClientRequestOption): Promise<HtptClientResponseOption<T>>;
}
