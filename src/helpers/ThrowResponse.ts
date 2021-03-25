export class ThrowResponse {
   data: any;
   status: number;

   constructor(data: any, status: number) {
      this.data = data;
      this.status = status;
   }
}
