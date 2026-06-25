import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WatchedController } from './watched.controller';
import { WatchedService } from './watched.service';
import { Watched } from './entities/watched.entity';
import { Movie } from '../movies/entities/movies.entity';
import { User } from '../users/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Watched, Movie, User])],
  controllers: [WatchedController],
  providers: [WatchedService],
})
export class WatchedModule {}
