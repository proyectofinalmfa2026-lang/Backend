import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/users.entity';
import { Review } from '../reviews/entities/reviews.entity';
import { Follower } from '../followers/entities/followers.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Follower)
    private readonly followerRepository: Repository<Follower>,
  ) {}

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: number) {
    return this.usersRepository.findOne({
      where: { id },
    });
  }


  async getProfile(id: number) {
  const user =
    await this.usersRepository.findOne({
      where: { id },
    });

  if (!user) {
    throw new Error('User not found');
  }

  const reviewsCount =
    await this.reviewRepository.count({
      where: {
        user: {
          id,
        },
      },
    });

  const followersCount =
    await this.followerRepository.count({
      where: {
        following: {
          id,
        },
      },
    });

  const followingCount =
    await this.followerRepository.count({
      where: {
        follower: {
          id,
        },
      },
    });

  return {
    id: user.id,
    name: user.name,
    username: user.username,
    avatar: user.avatar,
    bio: user.bio,
    reviewsCount,
    followersCount,
    followingCount,
  };
}

async updateAvatar(
  userId: number,
  avatarUrl: string,
) {
  const user =
    await this.usersRepository.findOne({
      where: { id: userId },
    });

  if (!user) {
    throw new Error('User not found');
  }

  user.avatar = avatarUrl;

  return this.usersRepository.save(user);
}

}