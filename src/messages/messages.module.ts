import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Message } from './entities/message.entity';
import { Conversation } from '../conversations/entities/conversation.entity';
import { User } from '../users/entities/users.entity';

import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Message,
      Conversation,
      User,
    ]),
  ],
  controllers: [MessagesController],
  providers: [MessagesService, RealtimeGateway],
  exports: [MessagesService],
})
export class MessagesModule {}