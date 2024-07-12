import {IsEmail, IsNotEmpty, Length} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(3, 20)
  readonly username: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}