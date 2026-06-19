import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Review } from './entities/reviews.entity';
import { User } from '../users/entities/users.entity';
import { Movie } from '../movies/entities/movies.entity';

import { CreateReviewDto } from './dto/create-review.dto';
import { Follower } from '../followers/entities/followers.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(Follower)
    private readonly followerRepository: Repository<Follower>,
  ) {}

  async getFeed(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [reviews, total] = await this.reviewRepository.findAndCount({
      relations: { movie: true, user: true },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });
    return { reviews, total, page, limit };
  }

  async getFollowingFeed(userId: number, page: number = 1, limit: number = 10) {
    const following = await this.followerRepository.find({
      where: { follower: { id: userId } },
      relations: { following: true },
    });

    if (following.length === 0) {
      return { reviews: [], total: 0, page, limit };
    }

    const followingIds = following.map((f) => f.following.id);
    const skip = (page - 1) * limit;

    const [reviews, total] = await this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.movie', 'movie')
      .leftJoinAndSelect('review.user', 'user')
      .where('user.id IN (:...ids)', { ids: followingIds })
      .orderBy('review.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { reviews, total, page, limit };
  }

  async create(createReviewDto: CreateReviewDto) {
    const user = await this.userRepository.findOne({
      where: {
        id: createReviewDto.userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const movie = await this.movieRepository.findOne({
      where: {
        id: createReviewDto.movieId,
      },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    const review = new Review();

    review.rating = createReviewDto.rating;

    review.comment = createReviewDto.comment;

    review.user = user;
    review.movie = movie;

    return this.reviewRepository.save(review);
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

  async pinReview(
  reviewId: string,
  userId: number,
) {
  const review = await this.reviewRepository.findOne({
    where: {
      id: reviewId,
    },
    relations: {
      user: true,
    },
  });

  if (!review) {
    throw new NotFoundException(
      'Review not found',
    );
  }

  if (review.user.id !== userId) {
    throw new ForbiddenException(
      'You can only pin your own reviews',
    );
  }

  const pinnedCount =
    await this.reviewRepository.count({
      where: {
        user: {
          id: userId,
        },
        isPinned: true,
      },
    });

  if (pinnedCount >= 3) {
    throw new ForbiddenException(
      'You can only pin up to 3 reviews',
    );
  }

  review.isPinned = true;

  await this.reviewRepository.save(review);

  return {
    message: 'Review pinned successfully',
  };
}

  async remove(id: string, userId: number, role: string) {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });

    if (!review) {
      throw new NotFoundException('Esta reseña no se pudo encontrar');
    }

    const isOwner = review.user.id === userId;
    const isAdmin = role === 'admin';

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        'Solo puedes eliminar tus propias opiniones',
      );
    }

    return this.reviewRepository.delete(id);
  }

  async unpinReview(
  reviewId: string,
  userId: number,
) {
  const review = await this.reviewRepository.findOne({
    where: {
      id: reviewId,
    },
    relations: {
      user: true,
    },
  });

  if (!review) {
    throw new NotFoundException(
      'Review not found',
    );
  }

  if (review.user.id !== userId) {
    throw new ForbiddenException(
      'You can only unpin your own reviews',
    );
  }

  review.isPinned = false;

  await this.reviewRepository.save(review);

  return {
    message: 'Review unpinned successfully',
  };
}
}
