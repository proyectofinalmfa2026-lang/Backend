import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movies.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  findAll() {
  return this.movieRepository.find({
    relations: {
      reviews: true,
    },
  });
}

findOne(id: string) {
  return this.movieRepository.findOne({
    where: { id },
    relations: {
      reviews: true,
    },
  });
}

  create(data: Partial<Movie>) {
    return this.movieRepository.save(data);
  }

  remove(id: string) {
    return this.movieRepository.delete(id);
  }
}