import * as parser from "body-parser";
import * as compression from "compression";
import * as cors from "cors";
import { Router } from "express";
import * as helmet from "helmet";
import * as cookie from "cookie-parser";
import * as csrf from "csurf";

export class Common {
   public static handleCors(router: Router): void {
      router.use(cors({ credentials: true, origin: true }));
   }

   public static handleBodyRequestParsing(router: Router): void {
      router.use(parser.urlencoded({ extended: true }));
      router.use(parser.json());
   }

   public static handleCompression(router: Router): void {
      router.use(compression());
   }

   public static handleHelmet(router: Router): void {
      router.use(helmet());
   }

   public static handCookieParsing(router: Router): void {
      router.use(cookie());
   }

   public static handleCsrf(router: Router): void {
      router.use(csrf({ cookie: true }));
   }
}
