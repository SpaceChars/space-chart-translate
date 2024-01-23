import XHRAdapter from './xhrAdapter';
import NodeHttpAdapter from './nodeHttpAdpater'
import { HtptClientResponseOption, HttpClientRequestDefaultOption, HttpClientRequestMethod, HttpClientRequestOption } from './adapterType'

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