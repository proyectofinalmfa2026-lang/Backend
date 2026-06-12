
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Like } from './entities/likes.entity';
import { User } from '../users/entities/users.entity';
import { Review } from '../reviews/entities/reviews.entity';

import { CreateLikeDto } from './dto/create-like.dto';

import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,

    private readonly notificationsService: NotificationsService,
  ) {}

  
async create(createLikeDto: CreateLikeDto) {
  const review = await this.reviewRepository.findOne({
    where: { id: createLikeDto.reviewId },
    relations: {
      user: true,
    },
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

  const existingLike =
    await this.likeRepository.findOne({
      where: {
        user: {
          id: user.id,
        },
        review: {
          id: review.id,
        },
      },
      relations: {
        user: true,
        review: true,
      },
    });

  if (existingLike) {
    await this.likeRepository.remove(
      existingLike,
    );

    return {
      liked: false,
      message: 'Like eliminado',
    };
  }

  const like = new Like();

  like.review = review;
  like.user = user;

  const savedLike =
    await this.likeRepository.save(like);

  if (
    review.user &&
    review.user.id !== user.id
  ) {
    await this.notificationsService.create({
      title: 'Nuevo like',
      message: `${user.username} le dio like a tu reseña`,
      userId: review.user.id,
    });
  }

  return {
    liked: true,
    message: 'Like agregado',
    like: savedLike,
  };
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

