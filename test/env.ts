import * as faker from 'faker';
/**
 * Load a test environment
 */
process.env.SILENCE_REPORT = 'true';
process.env.PORT = faker.datatype.number(1000, 9000);
process.env.NODE_ENV = 'testing';
process.env.SERVER_TIMEOUT = '1080000';
// SQL
process.env.SQL_HOST = process.env.SQL_HOST ?? '127.0.0.1';
process.env.SQL_USER = process.env.SQL_USER ?? 'root';
process.env.SQL_PASSWORD = process.env.SQL_PASSWORD ?? '';
process.env.SQL_DB = process.env.SQL_DB ?? 'task_management';
// Redis
process.env.REDIS_PORT = '6379';
process.env.REDIS_HOST = process.env.REDIS_HOST ?? '127.0.0.1';
process.env.REDIS_PASSWORD = process.env.REDIS_PASSWORD ?? '';
process.env.REDIS_DB = '1';

//JWT
process.env.JWT_SECRET = 'superlongsecretkeygoeshereprobablyagoodideatochangethisperproject';
process.env.JWT_TTL = '4h';
process.env.JWT_KEY = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
process.env.JWT_ENCRYPTION_KEY = 'x!A%D*G-KaPdSgVkYp3s6v8y/B?E(H+MbQeThWmZq4t7w!z$C&F)J@NcRfUjXn2r';

//HMAC
process.env.HTTP_HMAC_PRIVATE_KEY = 'thisisprivatekey';
process.env.HTTP_HMAC_PUBLIC_KEY = 'thisispublickey';
