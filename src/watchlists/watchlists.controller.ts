import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
} from '@nestjs/common';

import { WatchlistsService } from './watchlists.service';

@Controller('watchlists')
export class WatchlistsController {
  constructor(
    private readonly watchlistsService: WatchlistsService,
  ) {}

  @Get()
  findAll() {
    return this.watchlistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.watchlistsService.findOne(
      Number(id),
    );
  }

  @Post()
  create(@Body() body: any) {
    return this.watchlistsService.create(body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.watchlistsService.remove(
      Number(id),
    );
  }
}