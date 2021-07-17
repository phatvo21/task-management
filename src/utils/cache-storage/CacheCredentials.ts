import {parse} from 'url';

export class CacheCredentials {
  public password: string;
  public port: number;
  public host: string;
  public db: any;

  constructor(url: string) {
    const {hostname, port, auth, path} = parse(url);
    const exists = hostname && port && auth && path;

    if (exists) {
      this.password = auth.substr(auth.indexOf(':') + 1);
      this.port = +port;
      this.host = hostname;
      this.db = +path.substr(1) || 3;
    } else {
      this.password = process.env.REDIS_PASSWORD || '';
      this.port = parseInt(process.env.REDIS_PORT) || 6379;
      this.host = process.env.REDIS_HOST || '127.0.0.1';
      this.db = process.env.REDIS_DB || 3;
    }
  }
}
