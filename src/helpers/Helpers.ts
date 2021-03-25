import * as crypto from "crypto";

export class Helpers {
   public static isObjectEmpty(obj): boolean {
      return Object.keys(obj).length === 0 && obj.constructor === Object;
   }

   public static hmacEncrypt(key: string, serialized: string): string {
      return crypto.createHmac("sha512", key).update(serialized).digest("hex");
   }
}
