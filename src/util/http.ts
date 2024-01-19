import http, { Agent } from 'http'
import { Buffer } from 'node:buffer'
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
  data?: any,
  agent?: Agent
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
  data?: T
}

function send<T>(options: HttpClientRequestOption): Promise<HtptClientResponseOption<T>> {
  return new Promise<HtptClientResponseOption<T>>((resolve, reject) => {

    if (!options.url) {
      return reject({
        mesage: 'The request url is empty'
      })
    }

    if (!options.method) {
      return reject({
        mesage: 'The request method is empty'
      })
    }



    const urlInfo = new URL(options.url);

    const _options = Object.assign(options, {
      hostname: urlInfo.hostname || window.location.hostname || '127.0.0.1',
      port: urlInfo.port || 80,
      path: urlInfo.pathname + urlInfo.search || ''
    })

    delete _options.url;

    //创建请求示例
    const _h = http.request(
      _options,
      (res) => {
        //设置响应编码
        res.setEncoding('utf8');

        //监听数据响应
        let _data: any;
        res.on('data', (chunk) => {

          if (!_data) return _data = chunk;
          _data instanceof Buffer ? (_data.includes(chunk)) : (_data += chunk)

        })

        //监听响应结束
        res.on('end', () => {

          if (res.headers['content-type'].indexOf('application/json') >= 0) _data = JSON.parse(_data.toString() || '')

          resolve({
            code: res.statusCode || 500,
            message: res.statusMessage,
            data: _data
          })
        })


      }
    );

    //错误拦截
    _h.on('error', (e) => {
      reject({
        message: e.message
      })
    })

    //添加内容到body
    if (options.method == HttpClientRequestMethod.POST) {
      _h.write(JSON.stringify(options.data))
    }

    //设置超时时间
    if (options.timeout > 0 || !Number.isInteger(options.timeout)) {
      _h.setTimeout(options.timeout || 60000, () => {
        reject({
          message: 'time out'
        })
      })
    }


    //结束写入
    _h.end();

  });
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
    return send<T>(Object.assign(this.defaultOption, options))
  }
}

export class HttpClient {
  create(options: HttpClientRequestDefaultOption): HttpClientInstance {
    return new HttpClientInstance(options)
  }
}


export default new HttpClient()