import {ValidationHandle} from 'middlewares/ValidationHandle';
import {NextFunction, Request, Response} from 'express';
import {HttpCode} from 'constants/HttpCode';
import {ErrorType} from 'constants/ErrorType';
import {LoginDto} from 'components/auth/dto/LoginDto';

export class LoginValidate implements ValidationHandle {
  async use(request: Request, response: Response, next: NextFunction): Promise<void> {
    const body = request.body;
    const validateTask = new LoginDto(body);
    const errors = await validateTask.validate();
    if (errors.length > 0) {
      throw next({
        status: HttpCode.BadRequest,
        error_code: HttpCode.BadRequest,
        message: errors,
        type: ErrorType.Validate,
      });
    }
    return next();
  }
}
