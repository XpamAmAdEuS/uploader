import type { RequestOptions } from '../../types';

const setHeaders = (req: XMLHttpRequest, headers: any): void => {
  if (headers) {
    Object.keys(headers).forEach((name) => {
      if (headers[name] !== undefined) {
        req.setRequestHeader(name, headers[name]);
      }
    });
  }
};

const request = (
  url: string,
  data?: Document | XMLHttpRequestBodyInit,
  options: RequestOptions = {},
): Promise<XMLHttpRequest> => {
  const req = new XMLHttpRequest();

  const pXhr = new Promise<XMLHttpRequest>((resolve, reject) => {
    req.onerror = () => reject(req);
    req.ontimeout = () => reject(req);
    req.onabort = () => reject(req);
    req.onload = () => resolve(req);

    req.open(options.method || 'GET', url);
    setHeaders(req, options.headers!);
    req.withCredentials = !!options.withCredentials;

    if (options.preSend) {
      options.preSend(req);
    }

    req.send(data);
  });

  (pXhr as any).xhr = req;
  return pXhr;
};

export default request;
