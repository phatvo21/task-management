import {CommandInterface} from 'consoles/interface/CommandInterface';

export class Register {
  private readonly command: CommandInterface;

  constructor(command: CommandInterface) {
    this.command = command;
  }

  public register(): CommandInterface {
    return this.command;
  }
}
