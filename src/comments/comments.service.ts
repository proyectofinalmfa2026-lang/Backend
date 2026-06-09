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

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const review = await this.reviewRepository.findOne({
      where: { id: createCommentDto.reviewId },
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
      review,
      user,
    });

    return this.commentRepository.save(comment);
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

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
  ) {
    await this.commentRepository.update(
      id,
      updateCommentDto,
    );

    return this.findOne(id);
  }

  async remove(id: string) {
    return this.commentRepository.delete(id);
  }
}