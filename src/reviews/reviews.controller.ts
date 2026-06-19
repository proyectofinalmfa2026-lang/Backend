import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  Query,
  Req,
} from '@nestjs/common';

import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PremiumGuard } from '../auth/guards/premium.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.reviewsService.findByUser(Number(userId));
  }

  @Get('movie/:movieId')
  findByMovie(@Param('movieId') movieId: string) {
    return this.reviewsService.findByMovie(movieId);
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
    return this.reviewsService.getFollowingFeed(
      req.user.id,
      Number(page),
      Number(limit),
    );
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
  remove(@Param('id') id: string, @Req() req: any) {
    return this.reviewsService.remove(id, req.user.id, req.user.role);
  }

  @Patch(':id/pin')
@UseGuards(
  JwtAuthGuard,
  PremiumGuard,
)
pinReview(
  @Param('id') id: string,
  @Req() req: any,
) {
  return this.reviewsService.pinReview(
    id,
    req.user.id,
  );
}

@Patch(':id/unpin')
@UseGuards(
  JwtAuthGuard,
  PremiumGuard,
)
unpinReview(
  @Param('id') id: string,
  @Req() req: any,
) {
  return this.reviewsService.unpinReview(
    id,
    req.user.id,
  );
}
}
