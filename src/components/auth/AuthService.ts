import {Inject, Service} from 'typedi';
import {IAuthService} from 'components/auth/interfaces/IAuthService';
import {IUserRepository} from 'components/user/interfaces/IUserRepository';
import {UserRepository} from 'repositories/UserRepository';
import {ThrowResponse} from 'helpers/ThrowResponse';
import {Users} from 'databases/entities/Users';
import {UserModel} from 'components/auth/models/UserModel';
import {HttpCode as httpCode, HttpCode} from 'constants/HttpCode';
import {compare} from 'bcrypt';
import {ResponseMessage} from 'components/auth/constants/ResponseMessage';
import {ErrorType} from 'constants/ErrorType';
import {Helpers} from 'helpers/Helpers';

@Service('auth-service.factory')
export class AuthService implements IAuthService {
  private readonly userRepository: IUserRepository;

  constructor(
    @Inject('user-repository.factory')
    userRepository: UserRepository,
  ) {
    this.userRepository = userRepository;
  }

  public async register(data: UserModel): Promise<ThrowResponse> {
    const currentDate = Helpers.currentDateTime();
    const userEntity = new Users();
    userEntity.email = data.email;
    userEntity.password = data.password;
    userEntity.name = data.name;
    userEntity.createdAt = currentDate;
    userEntity.updatedAt = currentDate;
    const result = await this.userRepository.create(userEntity);
    delete result.password;
    return new ThrowResponse(result, HttpCode.Created);
  }

  public async login(data: UserModel): Promise<ThrowResponse> {
    const user = await this.findUserByEmail(data.email);
    const isValidPass = compare(data.password, user.password);
    if (!user || !isValidPass) {
      return new ThrowResponse(
        {
          status: httpCode.UnAuthorized,
          message: ResponseMessage.InValidPassword,
          type: ErrorType.InValid,
        },
        HttpCode.UnAuthorized,
      );
    }
    const token = Helpers.generateAccessToken({
      id: user.id,
      email: user.email,
    });
    return new ThrowResponse(
      {
        token: token,
        status: true,
      },
      HttpCode.Success,
    );
  }

  public findUserByEmail(email: string): Promise<Users> {
    return this.userRepository.findByCondition({
      email: email,
    });
  }
}
