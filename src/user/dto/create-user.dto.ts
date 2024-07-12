import {IsEmail, IsNotEmpty, Length} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'John',
    required: true
  })
  @IsNotEmpty()
  @Length(3, 20)
  readonly username: string;

  @ApiProperty({
    example: 'john@gmail.com',
    required: true
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}