import {BaseAbstractRepository} from 'repositories/base/base.abstract.repository';
import {Tasks} from 'databases/entities/Tasks';
import {ITaskRepository} from 'components/task/interfaces/ITaskRepository';
import {getRepository} from 'typeorm';
import {Service} from 'typedi';

@Service('task-repository.factory')
export class TaskRepository extends BaseAbstractRepository<Tasks> implements ITaskRepository {
  constructor() {
    super(getRepository(Tasks));
  }
}
