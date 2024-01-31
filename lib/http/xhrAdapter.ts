import { HtptClientResponseOption, HttpClientRequestOption, IHttpAdapter } from "./adapter";

export default class XHRAdapter implements IHttpAdapter {

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

      const request = new XMLHttpRequest();

      request.open(options.method.toLowerCase(), _options.hostname + _options.path);
      

    })
  }

}