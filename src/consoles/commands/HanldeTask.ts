import {Command} from 'consoles/Command';
import {CronJob} from 'cron';
import {CronSignature, CronTime} from 'consoles/constant/Cron';
import {GlobalTime} from 'constants/Environment';
import {TaskRepository} from 'repositories/TaskRepository';
import {TaskStatus} from 'components/task/constants/TaskStatus';

export class HandleTask extends Command {
  public signature = CronSignature.EveryMin;
  public taskRepository = new TaskRepository();

  constructor() {
    super();
  }

  public handle(): CronJob {
    return new CronJob(
      CronTime.EveryMin,
      async () => {
        const tasks = await this.taskRepository.findWithRelations({
          where: {status: TaskStatus.Pending},
        });
        if (tasks) {
          tasks.map(async (task) => {
            await this.taskRepository.update(
              {
                status: TaskStatus.Completed,
              },
              task.id,
            );
          });
        }
        console.log('crons');
      },
      null,
      true,
      GlobalTime.AsiaHoChiMinh,
    );
  }
}
