import {IsNotEmpty, IsOptional, IsString, validate, ValidationError} from 'class-validator';
import {TaskModel} from 'components/task/models/TaskModel';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  taskIdentity: string;

  @IsOptional()
  @IsString()
  description: string;

  constructor(dto: TaskModel) {
    this.title = dto.title;
    this.taskIdentity = dto.taskIdentity;
    this.description = dto.description;
  }

  public validate(): Promise<ValidationError[]> {
    return validate(this);
  }
}
