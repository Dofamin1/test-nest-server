import {Length, IsEmail, IsNumber, IsOptional} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class UpdateUserDto {
  @ApiProperty({
    example: 12,
    required: false
  })
  @IsNumber()
  readonly userId: number;

  @ApiProperty({
    example: 'John',
    required: false
  })
  @IsOptional()
  @Length(3, 20)
  readonly username: string;

  @ApiProperty({
    example: 'john@gmail.com',
    required: false
  })
  @IsOptional()
  @IsEmail()
  readonly email: string;
}