import {CronJob} from 'cron';
import {Register} from './Register';
import {HandleTask} from './commands/HanldeTask';

export class Kernel {
  private cronJobs: Map<string, CronJob> = new Map<string, CronJob>();
  private handleTask = new Register(new HandleTask());

  public static instance: Kernel;

  public static getInstance() {
    if (!Kernel.instance) {
      Kernel.instance = new Kernel();
    }
    return Kernel.instance;
  }

  public execute(): void {
    this.cronJobs.set(this.handleTask.register().signature, this.handleTask.register().handle());
    return this.cronJobs.forEach((job) => job.start());
  }
}
