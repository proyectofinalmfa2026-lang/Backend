import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { GoogleStrategy } from './strategies/google.strategies';

import { User } from '../users/entities/users.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
  TypeOrmModule.forFeature([User]),

  PassportModule,

  NotificationsModule,

  JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: {
        expiresIn: '1h',
      },
    }),
  }),
],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, GoogleStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}