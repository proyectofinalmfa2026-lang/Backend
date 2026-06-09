import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Comment } from './entities/comments.entity';
import { Review } from '../reviews/entities/reviews.entity';
import { User } from '../users/entities/users.entity';

import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,

    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const review = await this.reviewRepository.findOne({
      where: { id: createCommentDto.reviewId },
      relations: {
        user: true,
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    const user = await this.userRepository.findOne({
      where: { id: createCommentDto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const comment = this.commentRepository.create({
      content: createCommentDto.content,
      user,
      review,
    });

    const savedComment = await this.commentRepository.save(comment);

    // 🧠 SAFE: evitar crash si review.user no existe
    const reviewOwnerId = review?.user?.id;

    if (reviewOwnerId && reviewOwnerId !== user.id) {
      await this.notificationsService.create({
        title: 'Nuevo comentario',
        message: `${user.username} comentó tu reseña`,
        userId: reviewOwnerId,
      });
    }

    return savedComment;
  }

  findAll() {
    return this.commentRepository.find({
      relations: {
        user: true,
        review: true,
      },
    });
  }

  findOne(id: string) {
    return this.commentRepository.findOne({
      where: { id },
      relations: {
        user: true,
        review: true,
      },
    });
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    await this.commentRepository.update(id, updateCommentDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    return this.commentRepository.delete(id);
  }
}