import {ThrowResponse} from 'helpers/ThrowResponse';
import {Users} from 'databases/entities/Users';
import {UserModel} from 'components/auth/models/UserModel';

export interface IAuthService {
  register(data: UserModel): Promise<ThrowResponse>;

  login(data: UserModel): Promise<ThrowResponse>;

  findUserByEmail(email: string): Promise<Users>;
}
