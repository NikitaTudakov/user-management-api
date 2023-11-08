import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { connectionOptions } from 'ormconfig';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { jwtTokenConfig } from 'jwtTokenConfig';

@Module({
    imports: [
    UsersModule,
        AuthModule,
        TypeOrmModule.forRoot(connectionOptions),
        JwtModule.register(jwtTokenConfig),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
