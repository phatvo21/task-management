import {IsEmail, IsNotEmpty, IsString, MinLength, validate, ValidationError} from 'class-validator';
import {UserModel} from 'components/auth/models/UserModel';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  constructor(dto: UserModel) {
    this.email = dto.email;
    this.password = dto.password;
  }

  public validate(): Promise<ValidationError[]> {
    return validate(this);
  }
}
