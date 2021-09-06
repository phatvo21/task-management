import {Users} from '../../src/databases/entities/Users';
import {generateAccessToken} from '../../src/helpers/Helpers';

export function getAccessToken(user: Users): string {
  const {id, email} = user;
  return generateAccessToken({id, email});
}
