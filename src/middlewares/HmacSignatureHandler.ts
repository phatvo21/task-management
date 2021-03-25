import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";
import { NextFunction, Request, Response } from "express";
import { HttpCode } from "constants/HttpCode";
import { ErrorType } from "constants/ErrorType";
import { Helpers } from "helpers/Helpers";
import { httpHmacPrivateKey, httpHmacPublicKey } from "constants/Config";

@Middleware({ type: "before" })
export class HmacSignatureHandler implements ExpressMiddlewareInterface {
   async use(request: Request, response: Response, next: NextFunction): Promise<void> {
      const httpHmac = request.get("HTTP_HMAC");
      const generateHmacKey = Helpers.hmacEncrypt(httpHmacPrivateKey(), httpHmacPublicKey());
      console.log(generateHmacKey);
      if (httpHmac !== generateHmacKey) {
         throw next({
            status: HttpCode.UnAuthorized,
            error_code: HttpCode.UnAuthorized,
            message: "The hmac signature does not match",
            type: ErrorType.HmacInvalid,
         });
      }
      return next();
   }
}
