import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Watched } from './entities/watched.entity';
import { CreateWatchedDto } from './dto/create-watched.dto';
import { Movie } from '../movies/entities/movies.entity';
import { User } from '../users/entities/users.entity';

@Injectable()
export class WatchedService {
  constructor(
    @InjectRepository(Watched)
    private readonly watchedRepository: Repository<Watched>,
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userId: number, dto: CreateWatchedDto): Promise<Watched> {
    const existing = await this.watchedRepository.findOne({
      where: {
        user: { id: userId },
        movie: { id: dto.movieId },
      },
    });

    if (existing) {
      throw new ConflictException('Movie already in watched list');
    }

    const movie = await this.movieRepository.findOne({
      where: { id: dto.movieId },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    const watched = this.watchedRepository.create({
      user: { id: userId } as any,
      movie,
    });

    return this.watchedRepository.save(watched);
  }

  async findAllByUser(userId: number): Promise<Watched[]> {
    return this.watchedRepository.find({
      where: { user: { id: userId } },
      order: { watchedAt: 'DESC' },
    });
  }

  async findOneByUserAndMovie(
    userId: number,
    movieId: string,
  ): Promise<Watched | null> {
    return this.watchedRepository.findOne({
      where: {
        user: { id: userId },
        movie: { id: movieId },
      },
    });
  }

  async remove(userId: number, movieId: string): Promise<void> {
    const watched = await this.watchedRepository.findOne({
      where: {
        user: { id: userId },
        movie: { id: movieId },
      },
    });

    if (!watched) {
      throw new NotFoundException('Watched entry not found');
    }

    await this.watchedRepository.remove(watched);
  }
}
