import {CommandInterface} from 'consoles/interface/CommandInterface';
import {CronJob} from 'cron';

export abstract class Command implements CommandInterface {
  public abstract signature: string;

  public abstract async handle(): CronJob;
}
