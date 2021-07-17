import {NextFunction, Request, Response} from 'express';
import * as jwt from 'jsonwebtoken';
import {ExpressMiddlewareInterface} from 'routing-controllers';
import {HttpCode} from 'constants/HttpCode';
import {ErrorType} from 'constants/ErrorType';

export class Authorization implements ExpressMiddlewareInterface {
  private response: Response;
  public request: Request;

  public use(req: Request, res: Response, next: NextFunction): void {
    const headerToken = req.headers.authorization;
    this.response = res;
    this.request = req;
    this.checkToken(headerToken, next);
    if (headerToken) {
      return this.validateToken(headerToken, next);
    }
  }

  public checkToken(token: string, next: NextFunction): void {
    if (!token) {
      throw next({
        status: HttpCode.Forbidden,
        error_code: HttpCode.Forbidden,
        message: 'There is no token found',
        type: ErrorType.Validate,
      });
    }
  }

  public validateToken(token: string, next: NextFunction): void {
    try {
      const jwtPayload = jwt.verify(token, process.env.JWT_SECRET) as any;
      this.response.locals.jwtPayload = jwtPayload;
      this.setAuthorizeHeader(jwtPayload.data);
      next();
    } catch (error) {
      throw next({
        status: HttpCode.UnAuthorized,
        error_code: HttpCode.UnAuthorized,
        message: 'The token is invalid',
        type: ErrorType.InValid,
      });
    }
  }

  public setAuthorizeHeader(jwtPayloadData: {id: number; email: string}): void {
    const newToken = jwt.sign({data: jwtPayloadData}, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_TTL,
    });
    return this.response.setHeader('token', newToken);
  }
}
