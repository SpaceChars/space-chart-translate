import { HtptClientResponseOption, HttpClientRequestOption, IHttpAdapter } from "./adapter";

export default class XHRAdapter implements IHttpAdapter {

  send<T>(options: HttpClientRequestOption): Promise<HtptClientResponseOption<T>> {
    return new Promise<HtptClientResponseOption<T>>((resolve, reject) => {
      reject({})
    })
  }

}