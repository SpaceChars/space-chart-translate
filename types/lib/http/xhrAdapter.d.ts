import { HtptClientResponseOption, HttpClientRequestOption, IHttpAdapter } from "./adapterType";
export default class XHRAdapter implements IHttpAdapter {
    send<T>(options: HttpClientRequestOption): Promise<HtptClientResponseOption<T>>;
}
