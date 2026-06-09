import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Like } from './entities/likes.entity';
import { User } from '../users/entities/users.entity';
import { Review } from '../reviews/entities/reviews.entity';

import { CreateLikeDto } from './dto/create-like.dto';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async create(createLikeDto: CreateLikeDto) {
  const review = await this.reviewRepository.findOne({
    where: { id: createLikeDto.reviewId },
  });

  if (!review) {
    throw new NotFoundException(
      'Review not found',
    );
  }

  const user = await this.userRepository.findOne({
    where: { id: createLikeDto.userId },
  });

  if (!user) {
    throw new NotFoundException(
      'User not found',
    );
  }

  const like = new Like();

  like.review = review;
  like.user = user;

  return this.likeRepository.save(like);
}

  findAll() {
    return this.likeRepository.find({
      relations: {
        user: true,
        review: true,
      },
    });
  }

  findOne(id: string) {
    return this.likeRepository.findOne({
      where: { id },
      relations: {
        user: true,
        review: true,
      },
    });
  }

  remove(id: string) {
    return this.likeRepository.delete(id);
  }
}