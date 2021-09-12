import 'reflect-metadata';
import {AuthService} from './AuthService';
import {UserRepository} from 'repositories/UserRepository';
import * as faker from 'faker';
// @ts-ignore
import {factory} from '../../../test/factory/factory';
// @ts-ignore
import {hooks} from '../../../test/hooks';
import {UserModel} from './models/UserModel';
import * as helpers from 'helpers/Helpers';
import {genSaltSync, hashSync} from 'bcrypt';

// Init Global hook before the test
hooks();

// Mock the UserRepository class
jest.mock('repositories/UserRepository', () => {
  const mUserRepository = {
    create: jest.fn(),
    findByCondition: jest.fn(),
  };
  return {UserRepository: jest.fn(() => mUserRepository)};
});

describe('AuthService', () => {
  let userRepository: UserRepository;
  let authService: AuthService;
  const email = faker.internet.email();
  const password = faker.internet.password();
  const name = faker.lorem.word();
  const createdAt = faker.date.recent();
  let user;
  const token = faker.datatype.uuid();
  let currentDateTimeMock;
  let generateAccessMock;
  let hash = hashSync(password, genSaltSync(10));

  // Prepare user's credentials before creating
  const createBody: UserModel = {
    name,
    email,
    password,
  };

  // Prepare user's credentials before login
  const loginBody: UserModel = {
    email,
    password,
  };

  // Build and mock the test data before the testing
  beforeAll(async () => {
    // Create a user in users database table using factory
    user = await factory.build('user', {email, password: hash, name, createdAt, updatedAt: createdAt});

    // Init UserRepository instance
    userRepository = new UserRepository();

    // Init AuthService instance
    authService = new AuthService(userRepository);

    // Mock values return for create method inside UserRepository class
    userRepository.create = jest.fn().mockReturnValue(user);

    // Mock values return for findByCondition method inside UserRepository class
    userRepository.findByCondition = jest.fn().mockReturnValue({
      id: user.id,
      email,
      password: hash,
      name,
      createdAt,
      updatedAt: createdAt,
    });

    // Mock values return for currentDateTime function inside helpers
    currentDateTimeMock = jest.spyOn(helpers, 'currentDateTime').mockReturnValue(createdAt);

    // Mock values return for generateAccessToken function inside helpers
    generateAccessMock = jest.spyOn(helpers, 'generateAccessToken').mockReturnValue(token);
  });

  // Performs create user test
  it('should register a new user', async () => {
    const {
      data: {email, password, name},
      status,
    } = await authService.register(createBody);
    expect(userRepository.create).toHaveBeenCalledTimes(1);
    expect(currentDateTimeMock).toHaveBeenCalledTimes(1);
    expect(status).toEqual(201);
    expect(email).toEqual(user.email);
    expect(password).toEqual(user.password);
    expect(name).toEqual(user.name);
  });

  // Performs user's login using credentials test
  it("should login using user's credentials", async () => {
    const {data, status} = await authService.login(loginBody);
    expect(userRepository.findByCondition).toHaveBeenCalledTimes(1);
    expect(userRepository.findByCondition).toBeCalledWith({email: loginBody.email});
    expect(generateAccessMock).toHaveBeenCalledTimes(1);
    expect(generateAccessMock).toBeCalledWith({id: user.id, email: user.email});
    expect(status).toEqual(200);
    expect(data.token).toEqual(token);
  });
});
