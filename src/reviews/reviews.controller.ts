import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
} from '@nestjs/common';

import { ReviewsService } from './reviews.service';

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
  create(@Body() body: any) {
    return this.reviewsService.create(body);
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