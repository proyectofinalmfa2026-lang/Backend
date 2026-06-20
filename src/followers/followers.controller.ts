import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { FollowersService } from './followers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateFollowerDto } from './dto/create-follower.dto';

@Controller('followers')
export class FollowersController {
  constructor(
    private readonly followersService: FollowersService,
  ) {}

  @Post()
@UseGuards(JwtAuthGuard)
create(
  @Body()
  createFollowerDto: CreateFollowerDto,
) {
    return this.followersService.create(
      createFollowerDto,
    );
  }

  @Get()
  findAll() {
    return this.followersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.followersService.findOne(id);
  }

  @Get('user/followers/:userId')
  getFollowers(
    @Param('userId') userId: number,
  ) {
    return this.followersService.getFollowers(
      userId,
    );
  }

  @Get('user/following/:userId')
  getFollowing(
    @Param('userId') userId: number,
  ) {
    return this.followersService.getFollowing(
      userId,
    );
  }

  @Delete(':id')
@UseGuards(JwtAuthGuard)
remove(@Param('id') id: string) {
    return this.followersService.remove(id);
  }
}
