import { CronJob } from "cron";
import { PubSubEventsService } from "@services/PubSubEventsService";

export interface CommandInterface {
   signature: string;

   handle(pubsubService: PubSubEventsService): CronJob;
}
