/**
 * 请求方法
 */
 export enum HttpClientRequestMethod {
  GET = 'get',
  POST = 'post'
}

export interface HttpClientRequestDefaultOption {
  timeout?: number
}

/**
 * 请求体配置属性
 */
export interface HttpClientRequestOption extends HttpClientRequestDefaultOption {
  url?: string
  method?: HttpClientRequestMethod | string
  headers?: { [name: string]: string }
  params?: any
  data?: any
}

/**
 * 错误响应属性
 */
export interface HtptClientResponseError {
  message?: string
  code?: number | string
}

/**
 * 正常响应属性
 */
export interface HtptClientResponseOption<T> extends HtptClientResponseError {
  data: T | null
}

export interface IHttpAdapter {
  send<T>(options: HttpClientRequestOption): Promise<HtptClientResponseOption<T>>
}