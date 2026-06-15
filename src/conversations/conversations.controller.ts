import {
  Controller,
  Post,
  Get,
  Param,
  Body,
} from '@nestjs/common';

import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './DTO/CreateConversationDto';

@Controller('conversations')
export class ConversationsController {
  constructor(
    private readonly conversationsService: ConversationsService,
  ) {}

  @Post()
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