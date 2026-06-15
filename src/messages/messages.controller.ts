import {
  Controller,
  Get,
  Post,
  Param,
  Body,
} from '@nestjs/common';

import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/CreateMessageDto';

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
  ) {}

  @Post()
  create(
    @Body()
    createMessageDto: CreateMessageDto,
  ) {
    return this.messagesService.create(
      createMessageDto,
    );
  }

  @Get()
  findAll() {
    return this.messagesService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.messagesService.findOne(id);
  }

  @Get('conversation/:conversationId')
  findByConversation(
    @Param('conversationId')
    conversationId: string,
  ) {
    return this.messagesService.findByConversation(
      conversationId,
    );
  }
}