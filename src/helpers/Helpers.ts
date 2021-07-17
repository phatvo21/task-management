import * as crypto from 'crypto';
import * as moment from 'moment';
import * as jwt from 'jsonwebtoken';

export class Helpers {
  public static currentDateTime(): any {
    return moment().format('YYYY-MM-DD HH:mm:ss');
  }

  public static hmacEncrypt(key: string, serialized: string): string {
    return crypto.createHmac('sha512', key).update(serialized).digest('hex');
  }

  public static generateAccessToken(jwtPayLoad: {id: number; email: string}): string {
    return jwt.sign({data: jwtPayLoad}, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_TTL,
    });
  }

  public static async sleep(ms: number): Promise<NodeJS.Timer> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
