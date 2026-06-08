import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateMovieDto } from './dto/create-movie.dto';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las películas' })
  findAll() {
    return this.moviesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una película por ID' })
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id);
  }

  @Post()
create(
  @Body() createMovieDto: CreateMovieDto,
) {
  return this.moviesService.create(createMovieDto);
}

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una película' })
  remove(@Param('id') id: string) {
    return this.moviesService.remove(id);
  }
}