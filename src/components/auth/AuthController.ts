import { Response, Request } from "express";
import { Controller, HttpCode, Res, UseBefore, Post, Req, Body } from "routing-controllers";
import { HttpCode as httpCode } from "constants/HttpCode";
import { Inject } from "typedi";
import { BaseHttpResponse } from "helpers/BaseHttpResponse";
import { OpenAPI } from "routing-controllers-openapi";
import { IAuthService } from "components/auth/interfaces/IAuthService";
import { AuthService } from "components/auth/AuthService";
import { RegisterValidate } from "components/auth/validations/RegisterValidate";
import { UserModel } from "components/auth/models/UserModel";
import { userRegisterBody } from "components/auth/open-api-schema/UserRegisterBody";
import { ErrorType } from "constants/ErrorType";
import { ResponseMessage } from "components/auth/constants/ResponseMessage";
import { LoginValidate } from "components/auth/validations/LoginValidate";
import { userLoginBody } from "components/auth/open-api-schema/UserLoginBody";

@Controller("auth")
export class AuthController {
   private readonly authService: IAuthService;

   constructor(
      @Inject("auth-service.factory")
      authService: AuthService,
   ) {
      this.authService = authService;
   }

   @HttpCode(httpCode.Created)
   @UseBefore(RegisterValidate)
   @Post("/register")
   @OpenAPI({
      description: "User Register",
      parameters: [
         {
            in: "header",
            name: "HTTP_HMAC",
            required: true,
            example:
               "7283145dff4a4c7d642abb264f344b4170dd0f7fadda0e52779649a45ec150b1de8be4ff608c82f13d173f9ecbf479691c7e0058bf55168a179c3b50149569d9",
            schema: {
               type: "string",
            },
         },
      ],
      requestBody: {
         description: "User Register Request Body",
         content: {
            "application/json": {
               example: userRegisterBody,
            },
         },
         required: true,
      },
      responses: {
         400: {
            description: "Bad request",
         },
         500: {
            description: "Internal server",
         },
      },
   })
   public async userRegister<T>(
      @Res() res: Response,
      @Req() req: Request,
      @Body() data: UserModel,
   ): Promise<Response<T>> {
      const isExistEmail = await this.authService.findUserByEmail(data.email);
      console.log(isExistEmail);
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
   @Post("/login")
   @OpenAPI({
      description: "User Login",
      parameters: [
         {
            in: "header",
            name: "HTTP_HMAC",
            required: true,
            example:
               "7283145dff4a4c7d642abb264f344b4170dd0f7fadda0e52779649a45ec150b1de8be4ff608c82f13d173f9ecbf479691c7e0058bf55168a179c3b50149569d9",
            schema: {
               type: "string",
            },
         },
      ],
      requestBody: {
         description: "User Login Request Body",
         content: {
            "application/json": {
               example: userLoginBody,
            },
         },
         required: true,
      },
      responses: {
         400: {
            description: "Bad request",
         },
         500: {
            description: "Internal server",
         },
      },
   })
   public async userLogin<T>(@Res() res: Response, @Req() req: Request, @Body() data: UserModel): Promise<Response<T>> {
      const result = await this.authService.login(data);
      return BaseHttpResponse.onResult(res, result);
   }
}
