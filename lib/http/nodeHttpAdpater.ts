import * as http from 'http'
import { Buffer } from 'buffer';
import { HtptClientResponseOption, HttpClientRequestMethod, HttpClientRequestOption, IHttpAdapter } from './adapter';

export default class NodeHttpAdapter implements IHttpAdapter {

  send<T>(options: HttpClientRequestOption): Promise<HtptClientResponseOption<T>> {
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
        (res: any) => {
          //设置响应编码
          res.setEncoding('utf8');

          //监听数据响应
          let _data: any;
          res.on('data', (chunk: any) => {

            if (!_data) return _data = chunk;
            _data instanceof Buffer ? (_data.includes(chunk)) : (_data += chunk)

          })

          //监听响应结束
          res.on('end', () => {

            if ((res.headers['content-type'] || '').indexOf('application/json') >= 0) _data = JSON.parse(_data.toString() || '')

            resolve({
              code: res.statusCode || 500,
              message: res.statusMessage,
              data: _data
            })
          })


        }
      );

      //错误拦截
      _h.on('error', (e: any) => {
        reject({
          message: e.message
        })
      })

      //添加内容到body
      if (options.method == HttpClientRequestMethod.POST) {
        _h.write(JSON.stringify(options.data))
      }

      //设置超时时间
      if (!Number.isInteger(options.timeout) || Number(options.timeout) > 0) {
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

}