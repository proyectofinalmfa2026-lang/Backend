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

  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(Number(id));
  }

  @Post()
  create(@Body() body: any) {
    return this.reviewsService.create(body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(Number(id));
  }
}