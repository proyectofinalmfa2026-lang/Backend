import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Review } from './entities/reviews.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
  ) {}

  findAll() {
    return this.reviewsRepository.find({
  relations: {
    user: true,
  },
});
  }

  findOne(id: number) {
    return this.reviewsRepository.findOne({
  where: { id },
  relations: {
    user: true,
  },
});
  }

  create(review: Partial<Review>) {
    return this.reviewsRepository.save(review);
  }

  async remove(id: number) {
    await this.reviewsRepository.delete(id);

    return {
      message: 'Review eliminada',
    };
  }
}