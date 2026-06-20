import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';

import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
  ) {}

  @Post()
@UseGuards(JwtAuthGuard)
create(
  @Body() createCommentDto: CreateCommentDto,
) {
    return this.commentsService.create(
      createCommentDto,
    );
  }

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @Patch(':id')
@UseGuards(JwtAuthGuard)
update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(
      id,
      updateCommentDto,
    );
  }

  @Delete(':id')
@UseGuards(JwtAuthGuard)
remove(@Param('id') id: string) {
    return this.commentsService.remove(id);
  }
}