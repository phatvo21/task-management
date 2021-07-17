import {ThrowResponse} from 'helpers/ThrowResponse';
import {TaskModel} from 'components/task/models/TaskModel';
import {Tasks} from 'databases/entities/Tasks';

export interface ITaskService {
  queueTask(body: TaskModel): Promise<ThrowResponse>;

  findOneByTaskIdentity(taskIdentity: string): Promise<Tasks>;
}
