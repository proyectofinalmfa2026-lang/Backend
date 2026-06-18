import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../users/entities/users.entity';
import { Movie } from '../movies/entities/movies.entity';
import { Review } from '../reviews/entities/reviews.entity';
import { Comment } from '../comments/entities/comments.entity';
import { Like } from '../likes/entities/likes.entity';
import { NotFoundException } from '@nestjs/common';

import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserPremiumDto } from './dto/update-user-premium.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,

    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,

    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}

  async getDashboardStats() {
    const users = await this.userRepository.count();

    const premiumUsers = await this.userRepository.count({
      where: {
        isPremium: true,
      },
    });

    const movies = await this.movieRepository.count();

    const reviews = await this.reviewRepository.count();

    const comments = await this.commentRepository.count();

    const likes = await this.likeRepository.count();

    return {
      users,
      premiumUsers,
      movies,
      reviews,
      comments,
      likes,
    };
  }
  
  async getAllUsers() {
  const users = await this.userRepository.find({
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      isPremium: true,
      createdAt: true,
    },
    order: {
      createdAt: 'DESC',
    },
  });

  return users;
}

async updateUserRole(
  id: number,
  updateUserRoleDto: UpdateUserRoleDto,
) {
  const user = await this.userRepository.findOne({
    where: {
      id,
    },
  });

  if (!user) {
    throw new NotFoundException(
      'Usuario no encontrado',
    );
  }

  user.role = updateUserRoleDto.role;

  await this.userRepository.save(user);

  return {
    message: 'Rol actualizado correctamente',
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  };
}

async updateUserPremium(
  id: number,
  updateUserPremiumDto: UpdateUserPremiumDto,
) {
  const user = await this.userRepository.findOne({
    where: {
      id,
    },
  });

  if (!user) {
    throw new NotFoundException(
      'Usuario no encontrado',
    );
  }

  user.isPremium = updateUserPremiumDto.isPremium;

  await this.userRepository.save(user);

  return {
    message: 'Estado Premium actualizado correctamente',
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      isPremium: user.isPremium,
    },
  };
}

async getAllReviews() {
  const reviews = await this.reviewRepository.find({
    relations: {
      user: true,
      movie: true,
    },
    order: {
      createdAt: 'DESC',
    },
  });

 return reviews.map((review) => ({
  id: review.id,
  rating: review.rating,
  comment: review.comment,
  createdAt: review.createdAt,

  user: review.user
    ? {
        id: review.user.id,
        username: review.user.username,
      }
    : null,

  movie: review.movie
    ? {
        id: review.movie.id,
        title: review.movie.title,
      }
    : null,
}));
}

async deleteReview(id: string) {
  const review = await this.reviewRepository.findOne({
    where: {
      id,
    },
  });

  if (!review) {
    throw new NotFoundException(
      'Review no encontrada',
    );
  }

  await this.reviewRepository.remove(review);

  return {
    message: 'Review eliminada correctamente',
  };
}

async getAllComments() {
  const comments = await this.commentRepository.find({
    relations: {
      user: true,
      review: true,
    },
    order: {
      createdAt: 'DESC',
    },
  });

  return comments.map((comment) => ({
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,

    user: comment.user
      ? {
          id: comment.user.id,
          username: comment.user.username,
        }
      : null,

    review: comment.review
      ? {
          id: comment.review.id,
          rating: comment.review.rating,
        }
      : null,
  }));
}

async deleteComment(id: string) {
  const comment = await this.commentRepository.findOne({
    where: {
      id,
    },
  });

  if (!comment) {
    throw new NotFoundException(
      'Comentario no encontrado',
    );
  }

  await this.commentRepository.remove(comment);

  return {
    message: 'Comentario eliminado correctamente',
  };
}
}