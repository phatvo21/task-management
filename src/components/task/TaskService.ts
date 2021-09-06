import {ITaskService} from 'components/task/interfaces/ITaskService';
import {ThrowResponse} from 'helpers/ThrowResponse';
import {ITaskRepository} from 'components/task/interfaces/ITaskRepository';
import {Inject, Service} from 'typedi';
import {TaskRepository} from 'repositories/TaskRepository';
import {TaskStatus} from 'components/task/constants/TaskStatus';
import {currentDateTime} from 'helpers/Helpers';
import {ResponseMessage} from 'components/task/constants/ResponseMessage';
import {HttpCode} from 'constants/HttpCode';
import {TaskModel} from 'components/task/models/TaskModel';
import {Tasks} from 'databases/entities/Tasks';

@Service('task-service.factory')
export class TaskService implements ITaskService {
  private readonly taskRepository: ITaskRepository;

  constructor(
    @Inject('task-repository.factory')
    taskRepository: TaskRepository,
  ) {
    this.taskRepository = taskRepository;
  }

  public async queueTask(body: TaskModel): Promise<ThrowResponse> {
    const currentDate = currentDateTime();
    const createBody = {
      title: body.title,
      taskIdentity: body.taskIdentity,
      description: body.description,
      status: TaskStatus.Pending,
      createdAt: currentDate,
      updatedAt: currentDate,
    };
    await this.taskRepository.create(createBody);
    return new ThrowResponse(
      {
        message: ResponseMessage.TaskQueued,
      },
      HttpCode.Success,
    );
  }

  public findOneByTaskIdentity(taskIdentity: string): Promise<Tasks> {
    return this.taskRepository.findByCondition({
      taskIdentity: taskIdentity,
    });
  }
}
