import * as faker from 'faker';
import {Tasks} from '../../../src/databases/entities/Tasks';

export function taskFactoryWorker(overrides): Tasks {
  return {
    title: faker.lorem.word(),
    description: faker.lorem.word(),
    taskIdentity: faker.lorem.word(),
    status: 'pending',
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    ...overrides,
  };
}
