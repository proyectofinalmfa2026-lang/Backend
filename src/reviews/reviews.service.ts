import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Review } from './entities/reviews.entity';
import { User } from '../users/entities/users.entity';
import { Movie } from '../movies/entities/movies.entity';

import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async create(
    createReviewDto: CreateReviewDto,
  ) {
    const user =
      await this.userRepository.findOne({
        where: {
          id: createReviewDto.userId,
        },
      });

    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }

    const movie =
      await this.movieRepository.findOne({
        where: {
          id: createReviewDto.movieId,
        },
      });

    if (!movie) {
      throw new NotFoundException(
        'Movie not found',
      );
    }

    const review = new Review();

    review.rating =
      createReviewDto.rating;

    review.comment =
      createReviewDto.comment;

    review.user = user;
    review.movie = movie;

    return this.reviewRepository.save(
      review,
    );
  }

  findByUser(userId: number) {
  return this.reviewRepository.find({
    where: {
      user: {
        id: userId,
      },
    },
    relations: {
      movie: true,
      user: true,
    },
    order: {
      createdAt: 'DESC',
    },
  });
}

findByMovie(movieId: string) {
  return this.reviewRepository.find({
    where: {
      movie: {
        id: movieId,
      },
    },
    relations: {
      movie: true,
      user: true,
    },
  });
}

  findAll() {
    return this.reviewRepository.find({
      relations: {
        movie: true,
        user: true,
      },
    });
  }

  findOne(id: string) {
    return this.reviewRepository.findOne({
      where: { id },
      relations: {
        movie: true,
        user: true,
      },
    });
  }

  async remove(id: string) {
    return this.reviewRepository.delete(id);
  }
}