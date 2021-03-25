import { ValidationHandle } from "middlewares/ValidationHandle";
import { NextFunction, Request, Response } from "express";
import { HttpCode } from "constants/HttpCode";
import { ErrorType } from "constants/ErrorType";
import { CreateTaskDto } from "components/task/dto/CreateTaskDto";

export class CreateTaskValidate implements ValidationHandle {
   async use(request: Request, response: Response, next: NextFunction): Promise<void> {
      const body = request.body;
      const validateTask = new CreateTaskDto(body);
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
