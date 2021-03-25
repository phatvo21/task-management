import * as IORedis from "ioredis";
import { CacheCredentials } from "@utils/cache-storage/CacheCredentials";
import { Redis } from "ioredis";
import { IPubSub } from "@services/interface/IPubSub";

export class PubSubEventsService implements IPubSub {
   public ioRedis: Redis;

   constructor(url: string) {
      const parsed = new CacheCredentials(url);
      this.ioRedis = new IORedis({ ...parsed });

      const { options } = this.ioRedis;
      const { db, port, host } = options;

      console.log(
         `PubSub initialized, host: \x1b[34m${host}\x1b[0m, port: \x1b[34m${port}\x1b[0m, db: \x1b[34m${db}\x1b[0m`,
      );
   }

   public publisherEvent(channel: string, message: string): void {
      return this.ioRedis.publish(channel, JSON.stringify(message));
   }

   public subscriberEvent(channel: string): void {
      this.ioRedis.subscribe(channel);
      return this.ioRedis.on("message", (channel, message) => {
         return message;
      });
   }
}
