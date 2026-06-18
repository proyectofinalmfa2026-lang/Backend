import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

import { User } from '../users/entities/users.entity';
import { Movie } from '../movies/entities/movies.entity';
import { Review } from '../reviews/entities/reviews.entity';
import { Comment } from '../comments/entities/comments.entity';
import { Like } from '../likes/entities/likes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Movie,
      Review,
      Comment,
      Like,
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}