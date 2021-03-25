import { CommandInterface } from "@consoles/interface/CommandInterface";
import { CronJob } from "cron";
import { PubSubEventsService } from "@services/PubSubEventsService";

export abstract class Command implements CommandInterface {
   public abstract signature: string;

   public abstract async handle(pubsubService: PubSubEventsService): CronJob;
}
