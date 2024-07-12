import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/user.entity';
import config from '../config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: config.MYSQL_HOST,
      port: 3306,
      username: config.MYSQL_USER,
      password: config.MYSQL_PASSWORD,
      database: config.MYSQL_DATABASE,
      entities: [UserEntity],
      synchronize: true,
    }),
    UserModule,
  ],
  controllers: [
    AppController
  ],
  providers: []
})
export class AppModule {
  constructor() {}
}