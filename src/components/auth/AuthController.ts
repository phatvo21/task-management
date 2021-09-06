import {Response, Request} from 'express';
import {Controller, HttpCode, Res, UseBefore, Post, Req, Body} from 'routing-controllers';
import {HttpCode as httpCode} from 'constants/HttpCode';
import {Inject} from 'typedi';
import {BaseHttpResponse} from 'helpers/BaseHttpResponse';
import {IAuthService} from 'components/auth/interfaces/IAuthService';
import {AuthService} from 'components/auth/AuthService';
import {RegisterValidate} from 'components/auth/validations/RegisterValidate';
import {UserModel} from 'components/auth/models/UserModel';
import {ErrorType} from 'constants/ErrorType';
import {ResponseMessage} from 'components/auth/constants/ResponseMessage';
import {LoginValidate} from 'components/auth/validations/LoginValidate';

@Controller('auth')
export class AuthController {
  private readonly authService: IAuthService;

  constructor(
    @Inject('auth-service.factory')
    authService: AuthService,
  ) {
    this.authService = authService;
  }

  @HttpCode(httpCode.Created)
  @UseBefore(RegisterValidate)
  @Post('/register')
  public async userRegister<T>(
    @Res() res: Response,
    @Req() req: Request,
    @Body() data: UserModel,
  ): Promise<Response<T>> {
    const isExistEmail = await this.authService.findUserByEmail(data.email);
    if (isExistEmail) {
      return BaseHttpResponse.onResult(res, {
        status: httpCode.Conflict,
        message: ResponseMessage.EmailExisting,
        type: ErrorType.Conflict,
      });
    }
    const result = await this.authService.register(data);
    return BaseHttpResponse.onResult(res, result);
  }

  @HttpCode(httpCode.Created)
  @UseBefore(LoginValidate)
  @Post('/login')
  public async userLogin<T>(@Res() res: Response, @Req() req: Request, @Body() data: UserModel): Promise<Response<T>> {
    const result = await this.authService.login(data);
    return BaseHttpResponse.onResult(res, result);
  }
}
