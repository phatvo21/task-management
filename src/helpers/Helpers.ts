import * as crypto from 'crypto';
import * as moment from 'moment';
import * as jwt from 'jsonwebtoken';

export function currentDateTime(): any {
  return moment().format('YYYY-MM-DD HH:mm:ss');
}

export function hmacEncrypt(key: string, serialized: string): string {
  return crypto.createHmac('sha512', key).update(serialized).digest('hex');
}

export function generateAccessToken(jwtPayLoad: {id: number; email: string}): string {
  return jwt.sign({data: jwtPayLoad}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_TTL,
  });
}

export function sleep(ms: number): Promise<NodeJS.Timer> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
