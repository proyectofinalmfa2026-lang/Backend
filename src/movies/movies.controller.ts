import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { MoviesService } from './movies.service';
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
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
@ApiOperation({ summary: 'Crear una película (ADMIN)' })
create(
  @Body() createMovieDto: CreateMovieDto,
) {
  return this.moviesService.create(createMovieDto);
}

 @Delete(':id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
@ApiOperation({ summary: 'Eliminar una película (ADMIN)' })
remove(@Param('id') id: string) {
  return this.moviesService.remove(id);
}
}