import { Command } from "@consoles/Command";
import { CronJob } from "cron";
import { CronSignature, CronTime } from "@consoles/constant/Cron";
import { GlobalTime } from "@constants/Environment";
import { PubSubEventsService } from "@services/PubSubEventsService";

export class HandleTask extends Command {
   public signature = CronSignature.EveryMin;

   constructor() {
      super();
   }

   public handle(pubsubService: PubSubEventsService): CronJob {
      return new CronJob(
         CronTime.EveryMin,
         async () => {
            console.log("crons");
            // Handle here
         },
         null,
         true,
         GlobalTime.AsiaHoChiMinh,
      );
   }
}
