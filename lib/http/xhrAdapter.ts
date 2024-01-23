import { HtptClientResponseOption, HttpClientRequestOption, IHttpAdapter } from "./adapterType";

export default class XHRAdapter implements IHttpAdapter {

  send<T>(options: HttpClientRequestOption): Promise<HtptClientResponseOption<T>> {
    return new Promise<HtptClientResponseOption<T>>((resolve, reject) => {
      reject({})
    })
  }

}