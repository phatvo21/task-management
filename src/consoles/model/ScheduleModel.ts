export class ScheduleModel {
   public cronTime: string;
   public query: any;

   constructor(cronTime: string, query: any) {
      this.cronTime = cronTime;
      this.query = query;
   }
}
