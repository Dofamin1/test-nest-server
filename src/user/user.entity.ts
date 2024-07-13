import { Entity, PrimaryGeneratedColumn, Column, BeforeUpdate } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
@Entity('user')
export class UserEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @Column()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  updatedAt: Date;

  @BeforeUpdate()
  updateTimestamp() {
    const date = new Date();
    const utcDate = date.toUTCString();
    this.updatedAt = new Date(utcDate);
  }
}
