import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WatchedService } from './watched.service';
import { CreateWatchedDto } from './dto/create-watched.dto';

@Controller('watched')
export class WatchedController {
  constructor(private readonly watchedService: WatchedService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyWatched(@Req() req: any) {
    return this.watchedService.findAllByUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  async getUserWatched(@Param('userId') userId: string) {
    return this.watchedService.findAllByUser(+userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('check/:movieId')
  async checkWatched(@Req() req: any, @Param('movieId') movieId: string) {
    const watched = await this.watchedService.findOneByUserAndMovie(
      req.user.id,
      movieId,
    );
    return { watched: !!watched };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async addWatched(@Req() req: any, @Body() dto: CreateWatchedDto) {
    return this.watchedService.create(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':movieId')
  async removeWatched(@Req() req: any, @Param('movieId') movieId: string) {
    await this.watchedService.remove(req.user.id, movieId);
    return { message: 'Removed from watched' };
  }
}
