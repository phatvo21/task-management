import 'reflect-metadata';
import {TaskService} from './TaskService';
import {TaskRepository} from 'repositories/TaskRepository';
import * as faker from 'faker';
// @ts-ignore
import {factory} from '../../../test/factory/factory';
// @ts-ignore
import {hooks} from '../../../test/hooks';
import {TaskModel} from './models/TaskModel';
import * as helpers from '../../helpers/Helpers';

hooks();

jest.mock('repositories/TaskRepository', () => {
  const mTaskRepository = {
    create: jest.fn(),
    findByCondition: jest.fn(),
  };
  return {TaskRepository: jest.fn(() => mTaskRepository)};
});

describe('TaskService', () => {
  let taskRepository: TaskRepository;
  let taskService: TaskService;
  const title = faker.lorem.word();
  const taskIdentity = faker.lorem.word();
  const description = faker.lorem.word();
  const createdAt = faker.date.recent();
  let task;
  let currentDateTimeMock;

  const createBody: TaskModel = {
    title,
    taskIdentity,
    description,
  };

  beforeAll(async () => {
    task = await factory.build('task', {title, taskIdentity, description, createdAt, updatedAt: createdAt});
    taskRepository = new TaskRepository();

    taskService = new TaskService(taskRepository);

    taskRepository.create = jest.fn().mockReturnValue(task);

    taskRepository.findByCondition = jest.fn().mockReturnValue({
      id: task.id,
      title,
      taskIdentity,
      description,
      createdAt,
      updatedAt: createdAt,
    });

    currentDateTimeMock = jest.spyOn(helpers, 'currentDateTime').mockReturnValue(createdAt);
  });

  it('should queue a new task', async () => {
    const {
      data: {message},
      status,
    } = await taskService.queueTask(createBody);
    expect(taskRepository.create).toHaveBeenCalledTimes(1);
    expect(currentDateTimeMock).toHaveBeenCalledTimes(1);
    expect(status).toEqual(200);
    expect(message).toEqual('This task has been queued');
  });

  it('should return a task', async () => {
    const taskIdentity = createBody.taskIdentity;
    const result = await taskService.findOneByTaskIdentity(taskIdentity);
    expect(taskRepository.findByCondition).toHaveBeenCalledTimes(1);
    expect(taskRepository.findByCondition).toBeCalledWith({taskIdentity});
    expect(result.taskIdentity).toEqual(task.taskIdentity);
    expect(result.title).toEqual(task.title);
    expect(result.description).toEqual(task.description);
    expect(result.id).toEqual(task.id);
  });
});
