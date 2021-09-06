import {hmacEncrypt} from '../../src/helpers/Helpers';
import {httpHmacPrivateKey, httpHmacPublicKey} from '../../src/constants/Config';

export function getHmacSignature(): string {
  return hmacEncrypt(httpHmacPrivateKey(), httpHmacPublicKey());
}
