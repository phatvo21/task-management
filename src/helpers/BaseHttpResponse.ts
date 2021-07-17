import {Response} from 'express';

export class BaseHttpResponse {
  public static onResult(res: Response, data: any): any {
    return res.status(data.status).send(data);
  }
}

export class ErrorResponse {
  public status: number;
  public message: string;

  constructor(status: number, message: string) {
    this.status = status;
    this.message = message;
  }
}
