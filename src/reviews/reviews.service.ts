import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/reviews.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  findOne(id: string) {
    return this.reviewRepository.findOne({
      where: { id },
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

  create(review: Partial<Review>) {
    return this.reviewRepository.save(review);
  }

  async remove(id: string) {
    return this.reviewRepository.delete(id);
  }
}