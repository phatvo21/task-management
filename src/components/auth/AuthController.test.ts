import 'reflect-metadata';
import {AuthController} from './AuthController';
import {AuthService} from './AuthService';
import {UserRepository} from 'repositories/UserRepository';
// @ts-ignore
import {interceptor} from '../../../test/interceptor';
import * as faker from 'faker';
// @ts-ignore
import {factory} from '../../../test/factory/factory';
// @ts-ignore
import {hooks} from '../../../test/hooks';
import {UserModel} from './models/UserModel';

// Init Global hook before the test
hooks();

// Init mock request and response from interceptor
const {mockRequest, mockResponse} = interceptor;

// Mock the AuthService class
jest.mock('components/auth/AuthService', () => {
  const mAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    findUserByEmail: jest.fn(),
  };
  return {AuthService: jest.fn(() => mAuthService)};
});

// Mock the UserRepository class
jest.mock('repositories/UserRepository', () => {
  const mUserRepository = {
    create: jest.fn(),
    findByCondition: jest.fn(),
  };
  return {UserRepository: jest.fn(() => mUserRepository)};
});

describe('AuthController', () => {
  let userRepository: UserRepository;
  let authService: AuthService;
  let authController: AuthController;
  let req: any;
  let res: any;
  let token;
  const email = faker.internet.email();
  const password = faker.internet.password();
  const name = faker.lorem.word();
  let user;

  // Prepare user's credentials before registering
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
    user = await factory.build('user', {email, password, name});

    // Assignee the defined variables
    req = mockRequest();
    res = mockResponse();
    token = faker.datatype.uuid();

    // Init UserRepository instance
    userRepository = new UserRepository();

    // Init AuthService instance
    authService = new AuthService(userRepository);

    // Mock values return for register method inside AuthService class
    (authService.register as jest.MockedFunction<any>).mockReturnValue({data: user, status: 201});

    // Mock values return for login method inside AuthService class
    (authService.login as jest.MockedFunction<any>).mockReturnValue({
      data: {
        token,
        status: true,
      },
      status: 200,
    });

    // Init AuthController instance
    authController = new AuthController(authService);
  });

  // Performs the user's register test
  it('should register a new user', async () => {
    (authService.findUserByEmail as jest.MockedFunction<any>).mockReturnValue();
    const result = await authController.userRegister(res, req, createBody);
    expect(authService.findUserByEmail).toHaveBeenCalledTimes(1);
    expect(authService.findUserByEmail).toBeCalledWith(createBody.email);
    expect(authService.register).toHaveBeenCalledTimes(1);
    expect(authService.register).toBeCalledWith(createBody);
    expect(result.status).toBeCalledWith(201);
  });

  // Performs the user's login test
  it("should login using user's credentials", async () => {
    (authService.findUserByEmail as jest.MockedFunction<any>).mockReturnValue(user);
    const result = await authController.userLogin(res, req, loginBody);
    expect(authService.findUserByEmail).toHaveBeenCalledTimes(1);
    expect(authService.findUserByEmail).toBeCalledWith(loginBody.email);
    expect(result.status).toBeCalledWith(200);
  });
});
