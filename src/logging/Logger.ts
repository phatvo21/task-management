import { Environment } from "@constants/Environment";

const isTestEnv = process.env.NODE_ENV === Environment.Testing;

export const logger = {
   info: (context: any, message?: string) => {
      if (!isTestEnv) console.log(context, message);
   },
   warn: (context: any, message?: string) => {
      if (!isTestEnv) console.log(context, message);
   },
   error: (err: Error, message?: string) => {
      if (!isTestEnv) console.error(err, message);
   },
};
