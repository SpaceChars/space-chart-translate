import XHRAdapter from './xhrAdapter';
import NodeHttpAdapter from './nodeHttpAdpater'

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

/**
 * 请求客户端接口
 */
interface IHttpClient {
  get<T>(url: string, params?: any, options?: HttpClientRequestOption): Promise<HtptClientResponseOption<T>>
  post<T>(url: string, data?: any, options?: HttpClientRequestOption): Promise<HtptClientResponseOption<T>>
  request<T>(options: HttpClientRequestOption): Promise<HtptClientResponseOption<T>>

}

export class HttpClientInstance implements IHttpClient {
  private defaultOption: HttpClientRequestOption

  constructor(options: HttpClientRequestOption) {
    this.defaultOption = options
  }

  get<T>(url: string, params?: any, options?: HttpClientRequestOption | undefined): Promise<HtptClientResponseOption<T>> {
    return this.request<T>(Object.assign(this.defaultOption, options, { url, method: HttpClientRequestMethod.GET, params }))
  }

  post<T>(url: string, data?: any, options?: HttpClientRequestOption | undefined): Promise<HtptClientResponseOption<T>> {
    return this.request<T>(Object.assign(this.defaultOption, options, { url, method: HttpClientRequestMethod.POST, data }))
  }

  request<T>(options: HttpClientRequestOption): Promise<HtptClientResponseOption<T>> {
    const adapter = typeof XMLHttpRequest !== 'undefined' ? new XHRAdapter() : new NodeHttpAdapter();
    return adapter.send<T>(Object.assign(this.defaultOption, options))
  }
}

export class HttpClient {
  create(options: HttpClientRequestDefaultOption): HttpClientInstance {
    return new HttpClientInstance(options)
  }
}

export default new HttpClient()