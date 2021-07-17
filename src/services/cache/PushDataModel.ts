export class PushDataModel {
  public result: any;
  public exists: boolean;

  constructor(result: any, exists: boolean) {
    this.result = result;
    this.exists = exists;
  }
}
