import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { connectionOptions } from 'ormconfig';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRoot(connectionOptions),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
