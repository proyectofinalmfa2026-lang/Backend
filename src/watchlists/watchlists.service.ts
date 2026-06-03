import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Watchlist } from './entities/watchlists.entity';

@Injectable()
export class WatchlistsService {
  constructor(
    @InjectRepository(Watchlist)
    private watchlistsRepository: Repository<Watchlist>,
  ) {}

  findAll() {
    return this.watchlistsRepository.find();
  }

  findOne(id: number) {
    return this.watchlistsRepository.findOne({
      where: { id },
    });
  }

  create(watchlist: Partial<Watchlist>) {
    return this.watchlistsRepository.save(
      watchlist,
    );
  }

  async remove(id: number) {
    await this.watchlistsRepository.delete(id);

    return {
      message: 'Película eliminada de la watchlist',
    };
  }
}