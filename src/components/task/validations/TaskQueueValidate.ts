import { ValidationHandle } from "middlewares/ValidationHandle";
import { NextFunction, Request, Response } from "express";
import { HttpCode } from "constants/HttpCode";
import { ErrorType } from "constants/ErrorType";
import { TaskQueueDto } from "components/task/dto/TaskQueueDto";

export class TaskQueueValidate implements ValidationHandle {
   async use(request: Request, response: Response, next: NextFunction): Promise<void> {
      const body = request.body;
      const validateTask = new TaskQueueDto(body);
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
