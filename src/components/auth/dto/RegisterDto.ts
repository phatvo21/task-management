import {IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, validate, ValidationError} from 'class-validator';
import {UserModel} from 'components/auth/models/UserModel';

export class RegisterDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  constructor(dto: UserModel) {
    this.name = dto.name;
    this.email = dto.email;
    this.password = dto.password;
  }

  public validate(): Promise<ValidationError[]> {
    return validate(this);
  }
}
