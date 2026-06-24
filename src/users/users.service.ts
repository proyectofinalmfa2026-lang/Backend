import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/users.entity';
import { Review } from '../reviews/entities/reviews.entity';
import { Follower } from '../followers/entities/followers.entity';
import { Watchlist } from '../watchlists/entities/watchlists.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Follower)
    private readonly followerRepository: Repository<Follower>,
    @InjectRepository(Watchlist)
    private readonly watchlistRepository: Repository<Watchlist>,
  ) {}

  findAll() {
    return this.usersRepository.find();
  }

  search(query: string) {
    if (!query) return [];
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.name ILIKE :query', { query: `%${query}%` })
      .orWhere('user.username ILIKE :query', { query: `%${query}%` })
      .getMany();
  }

  findOne(id: number) {
    return this.usersRepository.findOne({
      where: { id },
    });
  }

  async getPublicProfile(username: string) {
    const user = await this.usersRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const reviewsCount = await this.reviewRepository.count({
      where: { user: { id: user.id } },
    });

    const followersCount = await this.followerRepository.count({
      where: { following: { id: user.id } },
    });

    const followingCount = await this.followerRepository.count({
      where: { follower: { id: user.id } },
    });

    const latestReviews = await this.reviewRepository.find({
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' },
      take: 5,
      relations: { movie: true },
    });

    const featuredReviews = await this.reviewRepository.find({
  where: {
    user: {
      id: user.id,
    },
    isPinned: true,
  },
  relations: {
    movie: true,
  },
  order: {
    createdAt: 'DESC',
  },
});

    const watchlistCount = await this.watchlistRepository.count({
      where: { user: { id: user.id } },
    });

    const allRatings = await this.reviewRepository.find({
      where: { user: { id: user.id } },
      select: { rating: true },
    });
    const avgRating =
      allRatings.length > 0
        ? Math.round(
            (allRatings.reduce((sum, r) => sum + r.rating, 0) /
              allRatings.length) *
              10,
          ) / 10
        : 0;

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      bio: user.bio,
      isPremium: user.isPremium,
      createdAt: user.createdAt,
      reviewsCount,
      watchlistCount,
      avgRating,
      followersCount,
      followingCount,
      favoriteGenres: user.favoriteGenres ?? [],
      badges: user.badges ?? [],
      featuredReviews: featuredReviews.map((r) => ({
  id: r.id,
  rating: r.rating,
  comment: r.comment,
  createdAt: r.createdAt,
  movie: {
    id: r.movie.id,
    title: r.movie.title,
  },
})),
      latestReviews: latestReviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        movie: {
          id: r.movie.id,
          title: r.movie.title,
        },
      })),
    };
  }

  async getProfile(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const reviewsCount = await this.reviewRepository.count({
      where: {
        user: {
          id,
        },
      },
    });

    const followersCount = await this.followerRepository.count({
      where: {
        following: {
          id,
        },
      },
    });

    const followingCount = await this.followerRepository.count({
      where: {
        follower: {
          id,
        },
      },
    });

    const watchlistCount = await this.watchlistRepository.count({
      where: { user: { id } },
    });

    const allRatings = await this.reviewRepository.find({
      where: { user: { id } },
      select: { rating: true },
    });
    const avgRating =
      allRatings.length > 0
        ? Math.round(
            (allRatings.reduce((sum, r) => sum + r.rating, 0) /
              allRatings.length) *
              10,
          ) / 10
        : 0;

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      bio: user.bio,
      isPremium: user.isPremium,
      createdAt: user.createdAt,
      reviewsCount,
      watchlistCount,
      avgRating,
      followersCount,
      followingCount,
      favoriteGenres: user.favoriteGenres ?? [],
      badges: user.badges ?? [],
    };
  }

  async getAdvancedStats(userId: number) {
  const reviews = await this.reviewRepository.find({
    where: {
      user: {
        id: userId,
      },
    },
    relations: {
      movie: true,
    },
  });

  if (reviews.length === 0) {
    return {
      message: 'No reviews available for statistics',
    };
  }

  const totalReviews = reviews.length;

  const averageRating =
    Math.round(
      (reviews.reduce(
        (sum, review) => sum + review.rating,
        0,
      ) / totalReviews) * 10,
    ) / 10;

  const genreCount: Record<string, number> = {};

  reviews.forEach((review) => {
    const genre = review.movie.genre;

    genreCount[genre] =
      (genreCount[genre] || 0) + 1;
  });

  const favoriteGenre =
    Object.entries(genreCount).sort(
      (a, b) => b[1] - a[1],
    )[0][0];

  const highestRatedMovie =
    reviews.reduce((best, current) =>
      current.rating > best.rating
        ? current
        : best,
    );

  const lowestRatedMovie =
    reviews.reduce((worst, current) =>
      current.rating < worst.rating
        ? current
        : worst,
    );

  return {
    totalReviews,
    averageRating,
    favoriteGenre,

    highestRatedMovie: {
      title: highestRatedMovie.movie.title,
      rating: highestRatedMovie.rating,
    },

    lowestRatedMovie: {
      title: lowestRatedMovie.movie.title,
      rating: lowestRatedMovie.rating,
    },
  };
}

  async updatePremium(id: number, isPremium: boolean) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new Error('User not found');
    }

    user.isPremium = isPremium;

    return this.usersRepository.save(user);
  }

  async updateAvatar(userId: number, avatar: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    user.avatar = avatar;

    return this.usersRepository.save(user);
  }
}
