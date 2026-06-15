import { Controller, Get, Post, Delete, Param, Body, Query, Req } from '@nestjs/common';

import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('user/:userId')
  findByUser(
    @Param('userId') userId: string,
  ) {
    return this.reviewsService.findByUser(
      Number(userId),
    );
  }

@Get('movie/:movieId')
findByMovie(
  @Param('movieId') movieId: string,
) {
  return this.reviewsService.findByMovie(
    movieId,
  );
}

  @Get('feed/general')
getFeed(
  @Query('page') page: string = '1',
  @Query('limit') limit: string = '10',
) {
  return this.reviewsService.getFeed(Number(page), Number(limit));
}

@Get('feed/following')
@UseGuards(JwtAuthGuard)
getFollowingFeed(
  @Req() req: any,
  @Query('page') page: string = '1',
  @Query('limit') limit: string = '10',
) {
  return this.reviewsService.getFollowingFeed(req.user.id, Number(page), Number(limit));
}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }
}
