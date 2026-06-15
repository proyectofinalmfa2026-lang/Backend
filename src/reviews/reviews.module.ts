import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Review } from './entities/reviews.entity';
import { User } from '../users/entities/users.entity';
import { Movie } from '../movies/entities/movies.entity';

import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { Follower } from '../followers/entities/followers.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Review,
      User,
      Movie,
      Follower,
    ]),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}