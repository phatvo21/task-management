import 'reflect-metadata';
import {TaskController} from './TaskController';
import {TaskService} from './TaskService';
import {TaskRepository} from 'repositories/TaskRepository';
// @ts-ignore
import {interceptor} from '../../../test/interceptor';
import * as faker from 'faker';
// @ts-ignore
import {factory} from '../../../test/factory/factory';
// @ts-ignore
import {hooks} from '../../../test/hooks';
import {TaskModel} from './models/TaskModel';
import {config} from '../../constants/Config';

hooks();

const {mockRequest, mockResponse} = interceptor;

jest.mock('components/task/TaskService', () => {
  const mTaskService = {
    queueTask: jest.fn(),
    findOneByTaskIdentity: jest.fn(),
  };
  return {TaskService: jest.fn(() => mTaskService)};
});

jest.mock('repositories/TaskRepository', () => {
  const mTaskRepository = {
    create: jest.fn(),
    findByCondition: jest.fn(),
  };
  return {TaskRepository: jest.fn(() => mTaskRepository)};
});

describe('TaskController', () => {
  let taskRepository: TaskRepository;
  let taskService: TaskService;
  let taskController: TaskController;
  let req: any;
  let res: any;
  let token;
  let task;

  const createTaskBody: TaskModel = {
    title: 'This is title',
    taskIdentity: 'ABCS_1000',
    description: 'This is long description',
  };

  beforeAll(async () => {
    task = await factory.build('task');
    req = mockRequest();
    res = mockResponse();
    token = faker.datatype.uuid();

    taskRepository = new TaskRepository();

    taskService = new TaskService(taskRepository);

    taskService.queueTask = jest.fn().mockReturnValue({});

    taskController = new TaskController(taskService);
  });

  it('should create a task in Redis', async () => {
    req.app.get(config.cacheService).taskCache = jest.fn().mockReturnValue({});
    const service = req.app.get(config.cacheService).taskCache;
    service.findOne = jest.fn().mockReturnValue(null);
    res.locals.data = jest.fn().mockReturnValue(createTaskBody);
    taskService.findOneByTaskIdentity = jest.fn().mockReturnValue(null);

    await taskController.createTask(res, req, createTaskBody);
    expect(service.findOne).toHaveBeenCalledTimes(1);
    expect(service.findOne).toBeCalledWith(createTaskBody.taskIdentity);
    expect(taskService.findOneByTaskIdentity).toHaveBeenCalledTimes(1);
    expect(taskService.findOneByTaskIdentity).toBeCalledWith(createTaskBody.taskIdentity);
  });

  it('should set task in queue', async () => {
    req.app.get(config.cacheService).taskCache = jest.fn().mockReturnValue({});
    const service = req.app.get(config.cacheService).taskCache;
    service.findOne = jest.fn().mockReturnValue(JSON.stringify(createTaskBody));
    res.locals.data = jest.fn().mockReturnValue(createTaskBody);
    const taskIdentity = createTaskBody.taskIdentity;

    await taskController.taskQueue(res, req, {taskIdentity});
    expect(service.findOne).toHaveBeenCalledTimes(1);
    expect(service.findOne).toBeCalledWith(taskIdentity);
    expect(taskService.queueTask).toHaveBeenCalledTimes(1);
    expect(taskService.queueTask).toBeCalledWith(createTaskBody);
  });

  it('should return task status', async () => {
    const taskIdentity = createTaskBody.taskIdentity;
    taskService.findOneByTaskIdentity = jest.fn().mockReturnValue(createTaskBody);

    await taskController.taskStatus(taskIdentity, res);
    expect(taskService.findOneByTaskIdentity).toHaveBeenCalledTimes(1);
    expect(taskService.findOneByTaskIdentity).toBeCalledWith(taskIdentity);
  });
});
