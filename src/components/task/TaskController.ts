import {Response, Request} from 'express';
import {Controller, HttpCode, Res, UseBefore, Post, Req, Body, UseAfter, Get, Param} from 'routing-controllers';
import {HttpCode as httpCode} from 'constants/HttpCode';
import {Inject} from 'typedi';
import {BaseHttpResponse} from 'helpers/BaseHttpResponse';
import {DraftTask} from 'components/task/DraftTask';
import {CreateTaskValidate} from 'components/task/validations/CreateTaskValidate';
import {ResponseMessage} from 'components/task/constants/ResponseMessage';
import {config} from 'constants/Config';
import {ErrorType} from 'constants/ErrorType';
import {TaskQueueValidate} from 'components/task/validations/TaskQueueValidate';
import {RemoveDraftTask} from 'components/task/RemoveDraftTask';
import {ITaskService} from 'components/task/interfaces/ITaskService';
import {TaskService} from 'components/task/TaskService';
import {TaskModel} from 'components/task/models/TaskModel';
import {ThrowResponse} from 'helpers/ThrowResponse';
import {createTaskBody} from 'components/task/open-api-schema/CreateTaskBody';
import {OpenAPI} from 'routing-controllers-openapi';
import {queueTask} from 'components/task/open-api-schema/QueueTaskBody';
import {Authorization} from 'middlewares/Authorization';

@UseBefore(Authorization)
@Controller('tasks')
export class TaskController {
  private readonly taskService: ITaskService;

  constructor(
    @Inject('task-service.factory')
    taskService: TaskService,
  ) {
    this.taskService = taskService;
  }

  @HttpCode(httpCode.Created)
  @UseBefore(CreateTaskValidate)
  @UseAfter(DraftTask)
  @Post()
  @OpenAPI({
    description: 'Create Task',
    parameters: [
      {
        in: 'header',
        name: 'Authorization',
        required: true,
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        schema: {
          type: 'string',
        },
      },
      {
        in: 'header',
        name: 'HTTP_HMAC',
        required: true,
        example:
          '7283145dff4a4c7d642abb264f344b4170dd0f7fadda0e52779649a45ec150b1de8be4ff608c82f13d173f9ecbf479691c7e0058bf55168a179c3b50149569d9',
        schema: {
          type: 'string',
        },
      },
    ],
    requestBody: {
      description: 'Create Task Request Body',
      content: {
        'application/json': {
          example: createTaskBody,
        },
      },
      required: true,
    },
    responses: {
      400: {
        description: 'Bad request',
      },
      500: {
        description: 'Internal server',
      },
    },
  })
  public async createTask<T>(@Res() res: Response, @Req() req: Request, @Body() data: TaskModel): Promise<Response<T>> {
    const {app} = req;
    const service = app.get(config.cacheService).taskCache;
    const taskCache = await service.findOne(data.taskIdentity);
    const task = await this.taskService.findOneByTaskIdentity(data.taskIdentity);
    if (JSON.parse(taskCache) || task) {
      return BaseHttpResponse.onResult(res, {
        status: httpCode.Conflict,
        message: ResponseMessage.TaskIdentityExisting,
        type: ErrorType.Conflict,
      });
    }
    const result = new ThrowResponse(ResponseMessage.TaskCreated, httpCode.Created);
    res.locals.data = data;
    return BaseHttpResponse.onResult(res, result);
  }

  @HttpCode(httpCode.Success)
  @UseBefore(TaskQueueValidate)
  @UseAfter(RemoveDraftTask)
  @Post('/queue')
  @OpenAPI({
    description: 'Queue Task',
    parameters: [
      {
        in: 'header',
        name: 'Authorization',
        required: true,
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        schema: {
          type: 'string',
        },
      },
      {
        in: 'header',
        name: 'HTTP_HMAC',
        required: true,
        example:
          '7283145dff4a4c7d642abb264f344b4170dd0f7fadda0e52779649a45ec150b1de8be4ff608c82f13d173f9ecbf479691c7e0058bf55168a179c3b50149569d9',
        schema: {
          type: 'string',
        },
      },
    ],
    requestBody: {
      description: 'Queue Task Request Body',
      content: {
        'application/json': {
          example: queueTask,
        },
      },
      required: true,
    },
    responses: {
      400: {
        description: 'Bad request',
      },
      500: {
        description: 'Internal server',
      },
    },
  })
  public async taskQueue<T>(
    @Res() res: Response,
    @Req() req: Request,
    @Body() data: {taskIdentity: string},
  ): Promise<Response<T>> {
    const {app} = req;
    const service = app.get(config.cacheService).taskCache;
    const taskCache = await service.findOne(data.taskIdentity);
    if (!JSON.parse(taskCache)) {
      return BaseHttpResponse.onResult(res, {
        status: httpCode.NotFound,
        message: ResponseMessage.TaskNotFound,
        type: ErrorType.NotFound,
      });
    }
    const parsedTask = JSON.parse(taskCache);
    const result = await this.taskService.queueTask(parsedTask);
    res.locals.data = parsedTask;
    return BaseHttpResponse.onResult(res, result);
  }

  @HttpCode(httpCode.Success)
  @Get('/:taskIdentity/status')
  @OpenAPI({
    description: 'Task Status',
    parameters: [
      {
        in: 'path',
        name: 'taskIdentity',
        required: true,
        example: 'ABCS_1000',
        schema: {
          type: 'string',
        },
      },
      {
        in: 'header',
        name: 'Authorization',
        required: true,
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        schema: {
          type: 'string',
        },
      },
      {
        in: 'header',
        name: 'HTTP_HMAC',
        required: true,
        example:
          '7283145dff4a4c7d642abb264f344b4170dd0f7fadda0e52779649a45ec150b1de8be4ff608c82f13d173f9ecbf479691c7e0058bf55168a179c3b50149569d9',
        schema: {
          type: 'string',
        },
      },
    ],
    responses: {
      500: {
        description: 'Internal server',
      },
    },
  })
  public async taskStatus<T>(@Param('taskIdentity') taskIdentity: string, @Res() res: Response): Promise<Response<T>> {
    const task = await this.taskService.findOneByTaskIdentity(taskIdentity);
    if (!task) {
      return BaseHttpResponse.onResult(res, {
        status: httpCode.NotFound,
        message: ResponseMessage.TaskNotFound,
        type: ErrorType.NotFound,
      });
    }
    const result = new ThrowResponse(task, httpCode.Created);
    return BaseHttpResponse.onResult(res, result);
  }
}
