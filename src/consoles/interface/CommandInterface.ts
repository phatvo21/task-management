import {CronJob} from 'cron';

export interface CommandInterface {
  signature: string;

  handle(): CronJob;
}
