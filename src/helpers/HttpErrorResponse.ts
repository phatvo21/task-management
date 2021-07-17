import {ErrorResponse} from 'helpers/BaseHttpResponse';
import {HttpCode} from 'constants/HttpCode';

export class HttpErrorResponse {
  public static throwError400(message: string) {
    return new ErrorResponse(HttpCode.BadRequest, message);
  }
}
