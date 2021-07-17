import {IsNotEmpty, IsString, validate, ValidationError} from 'class-validator';

export class TaskQueueDto {
  @IsNotEmpty()
  @IsString()
  taskIdentity: string;

  constructor(dto: {taskIdentity: string}) {
    this.taskIdentity = dto.taskIdentity;
  }

  public validate(): Promise<ValidationError[]> {
    return validate(this);
  }
}
