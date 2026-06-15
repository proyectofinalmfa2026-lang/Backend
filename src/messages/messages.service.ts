import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Message } from './entities/message.entity';
import { Conversation } from '../conversations/entities/conversation.entity';
import { User } from '../users/entities/users.entity';

import { CreateMessageDto } from './dto/CreateMessageDto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,

    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createMessageDto: CreateMessageDto,
  ) {
    const conversation =
      await this.conversationRepository.findOne({
        where: {
          id: createMessageDto.conversationId,
        },
      });

    if (!conversation) {
      throw new NotFoundException(
        'Conversation not found',
      );
    }

    const sender =
      await this.userRepository.findOne({
        where: {
          id: createMessageDto.senderId,
        },
      });

    if (!sender) {
      throw new NotFoundException(
        'User not found',
      );
    }

    const message = new Message();

    message.content =
      createMessageDto.content;

    message.sender = sender;

    message.conversation =
      conversation;

    return this.messageRepository.save(
      message,
    );
  }

  findAll() {
    return this.messageRepository.find();
  }

  findOne(id: string) {
    return this.messageRepository.findOne({
      where: { id },
    });
  }

  async findByConversation(
    conversationId: string,
  ) {
    return this.messageRepository.find({
      where: {
        conversation: {
          id: conversationId,
        },
      },
      order: {
        createdAt: 'ASC',
      },
    });
  }
}