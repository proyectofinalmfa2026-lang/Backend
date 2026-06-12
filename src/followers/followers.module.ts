import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Follower } from './entities/followers.entity';
import { User } from '../users/entities/users.entity';

import { FollowersController } from './followers.controller';
import { FollowersService } from './followers.service';

import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Follower,
      User,
    ]),
    NotificationsModule,
  ],
  controllers: [FollowersController],
  providers: [FollowersService],
  exports: [FollowersService],
})
export class FollowersModule {}

