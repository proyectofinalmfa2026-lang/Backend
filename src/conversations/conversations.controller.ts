import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';

import { ConversationsService } from './conversations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateConversationDto } from './DTO/CreateConversationDto';

@Controller('conversations')
export class ConversationsController {
  constructor(
    private readonly conversationsService: ConversationsService,
  ) {}

  @Post()
@UseGuards(JwtAuthGuard)
create(
    @Body()
    createConversationDto: CreateConversationDto,
  ) {
    return this.conversationsService.create(
      createConversationDto,
    );
  }

  @Get()
  findAll() {
    return this.conversationsService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.conversationsService.findOne(
      id,
    );
  }

  @Get('user/:userId')
  findByUser(
    @Param('userId') userId: string,
  ) {
    return this.conversationsService.findByUser(
      Number(userId),
    );
  }
}