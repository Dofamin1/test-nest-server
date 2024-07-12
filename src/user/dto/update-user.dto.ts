import {Length, IsEmail, IsNumber, IsOptional} from "class-validator";

export class UpdateUserDto {
  @IsNumber()
  readonly userId: number;

  @IsOptional()
  @Length(3, 20)
  readonly username: string;

  @IsOptional()
  @IsEmail()
  readonly email: string;
}