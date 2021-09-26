type ResponseStatus = 'success' | 'fail';

interface ResponseBody {
  status: ResponseStatus;
  data: unknown;
}

export class Utils {
  static createResponseBody = (
    status: ResponseStatus,
    data: unknown
  ): ResponseBody => ({ status, data });
}
