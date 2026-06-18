import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Watchlist } from './entities/watchlists.entity';
import { Movie } from '../movies/entities/movies.entity';

@Injectable()
export class WatchlistsService {
  constructor(
    @InjectRepository(Watchlist)
    private readonly watchlistRepository: Repository<Watchlist>,

    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async getMyWatchlist(userId: number) {
    return this.watchlistRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async getAllWatchlists() {
    return this.watchlistRepository.find({
      relations: {
        user: true,
        movie: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async addMovie(userId: number, movieId: string) {
    const movie = await this.movieRepository.findOne({
      where: {
        id: movieId,
      },
    });

    if (!movie) {
      throw new NotFoundException('Película no encontrada');
    }

    const existing = await this.watchlistRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        movie: {
          id: movieId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('La película ya está en tu watchlist');
    }

    const watchlist = this.watchlistRepository.create({
      user: {
        id: userId,
      } as any,
      movie,
    });

    return this.watchlistRepository.save(watchlist);
  }

  async removeMovie(userId: number, movieId: string) {
    const watchlist = await this.watchlistRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        movie: {
          id: movieId,
        },
      },
    });

    if (!watchlist) {
      throw new NotFoundException('Película no encontrada en tu watchlist');
    }

    await this.watchlistRepository.remove(watchlist);

    return {
      message: 'Película eliminada de la watchlist',
    };
  }
}
