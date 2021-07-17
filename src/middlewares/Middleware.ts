import {Common} from 'middlewares/./Common';

export class Middleware {
  public static handle(): any[] {
    return [
      Common.handleCors,
      Common.handleBodyRequestParsing,
      Common.handleCompression,
      Common.handleHelmet,
      Common.handCookieParsing,
    ];
  }
}
