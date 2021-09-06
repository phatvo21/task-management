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

hooks();

const {mockRequest, mockResponse} = interceptor;

jest.mock('components/auth/AuthService', () => {
  const mAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    findUserByEmail: jest.fn(),
  };
  return {AuthService: jest.fn(() => mAuthService)};
});

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

  const createBody: UserModel = {
    name,
    email,
    password,
  };

  const loginBody: UserModel = {
    email,
    password,
  };

  beforeAll(async () => {
    user = await factory.build('user', {email, password, name});
    req = mockRequest();
    res = mockResponse();
    token = faker.datatype.uuid();
    userRepository = new UserRepository();

    authService = new AuthService(userRepository);

    (authService.register as jest.MockedFunction<any>).mockReturnValue({data: user, status: 201});
    (authService.login as jest.MockedFunction<any>).mockReturnValue({
      data: {
        token,
        status: true,
      },
      status: 200,
    });

    authController = new AuthController(authService);
  });

  it('should register a new user', async () => {
    (authService.findUserByEmail as jest.MockedFunction<any>).mockReturnValue();
    const result = await authController.userRegister(res, req, createBody);
    expect(authService.findUserByEmail).toHaveBeenCalledTimes(1);
    expect(authService.findUserByEmail).toBeCalledWith(createBody.email);
    expect(authService.register).toHaveBeenCalledTimes(1);
    expect(authService.register).toBeCalledWith(createBody);
    expect(result.status).toBeCalledWith(201);
  });

  it("should login using user's credentials", async () => {
    (authService.findUserByEmail as jest.MockedFunction<any>).mockReturnValue(user);
    const result = await authController.userLogin(res, req, loginBody);
    expect(authService.findUserByEmail).toHaveBeenCalledTimes(1);
    expect(authService.findUserByEmail).toBeCalledWith(loginBody.email);
    expect(result.status).toBeCalledWith(200);
  });
});
