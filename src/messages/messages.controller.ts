import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';

import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/CreateMessageDto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
  ) {}

  @UseGuards(JwtAuthGuard)
@Post()
create(
 @Body() dto: CreateMessageDto,
 @Req() req
){
 return this.messagesService.create(
   dto,
   req.user.id
 );
}

  @UseGuards(JwtAuthGuard)
@Get()
findAll() {
  return this.messagesService.findAll();
}

  @UseGuards(JwtAuthGuard)
@Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.messagesService.findOne(id);
  }

  @Get('conversation/:conversationId')
@UseGuards(JwtAuthGuard)
findByConversation(
  @Param('conversationId')
  conversationId: string,
  @Req() req: any,
) {
  return this.messagesService.findByConversation(
    conversationId,
    req.user.id,
  );
}
}