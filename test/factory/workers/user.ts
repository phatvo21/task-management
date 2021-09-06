import * as faker from 'faker';
import {Users} from '../../../src/databases/entities/Users';

export function userFactoryWorker(overrides): Users {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
    name: faker.lorem.word(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    ...overrides,
  };
}
