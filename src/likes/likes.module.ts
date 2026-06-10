import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Like } from './entities/likes.entity';

import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';

import { User } from '../users/entities/users.entity';
import { Review } from '../reviews/entities/reviews.entity';

import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Like,
      User,
      Review,
    ]),
    NotificationsModule,
  ],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}