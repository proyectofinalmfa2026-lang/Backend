import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

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
  @ApiOperation({ summary: 'Crear una película' })
  create(@Body() body: any) {
    return this.moviesService.create(body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una película' })
  remove(@Param('id') id: string) {
    return this.moviesService.remove(id);
  }
}