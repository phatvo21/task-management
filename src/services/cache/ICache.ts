import { PushDataModel } from "@services/cache/PushDataModel";

export interface ICache {
   push(data: string, key: string): Promise<PushDataModel>;

   all(key: string): Promise<string | Error>;

   findOne(key: string): Promise<string | Error>;
}
