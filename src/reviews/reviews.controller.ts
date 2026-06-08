import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
} from '@nestjs/common';

import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
  ) {}


 @Get(':id')
findOne(@Param('id') id: string) {
  return this.reviewsService.findOne(id);
}

  @Post()
create(
  @Body() createReviewDto: CreateReviewDto,
) {
  return this.reviewsService.create(createReviewDto);
}

  @Get()
findAll() {
  return this.reviewsService.findAll();
}

@Delete(':id')
remove(@Param('id') id: string) {
  return this.reviewsService.remove(id);
}

}