import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';

import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WatchlistsService } from './watchlists.service';
import { CreateWatchlistDto } from './dto/create-watchlist.dto';

@Controller('watchlists')
@UseGuards(JwtAuthGuard)
export class WatchlistsController {
  constructor(private readonly watchlistsService: WatchlistsService) {}

  @Get('me')
  getMyWatchlist(@Req() req: any) {
    console.log('ENTRO A WATCHLIST ME');
    console.log(req.user);
    return this.watchlistsService.getMyWatchlist(req.user.id);
  }
  @Post()
  addMovie(@Req() req: any, @Body() body: CreateWatchlistDto) {
    return this.watchlistsService.addMovie(req.user.id, body.movieId);
  }

  @Delete(':movieId')
  removeMovie(@Req() req: any, @Param('movieId') movieId: string) {
    return this.watchlistsService.removeMovie(req.user.id, movieId);
  }

  @Get('admin/all')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getAllWatchlists() {
    return this.watchlistsService.getAllWatchlists();
  }
}
