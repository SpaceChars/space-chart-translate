import { HtptClientResponseOption, HttpClientRequestOption, IHttpAdapter } from './adapterType';
export default class NodeHttpAdapter implements IHttpAdapter {
    send<T>(options: HttpClientRequestOption): Promise<HtptClientResponseOption<T>>;
}
