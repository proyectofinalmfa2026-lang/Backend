import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';

import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateLikeDto } from './dto/create-like.dto';

@Controller('likes')
export class LikesController {
  constructor(
    private readonly likesService: LikesService,
  ) {}

  @Post()
@UseGuards(JwtAuthGuard)
create(
    @Body() createLikeDto: CreateLikeDto,
  ) {
    return this.likesService.create(
      createLikeDto,
    );
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.likesService.findByUser(+userId);
  }

  @Get('review/:reviewId')
  findByReview(@Param('reviewId') reviewId: string) {
    return this.likesService.findByReview(reviewId);
  }

  @Get()
  findAll() {
    return this.likesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.likesService.findOne(id);
  }

  @Delete(':id')
@UseGuards(JwtAuthGuard)
remove(@Param('id') id: string) {
    return this.likesService.remove(id);
  }
}