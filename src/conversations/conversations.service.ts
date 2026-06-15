import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Conversation } from './entities/conversation.entity';
import { User } from '../users/entities/users.entity';

import { CreateConversationDto } from './DTO/CreateConversationDto';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createConversationDto: CreateConversationDto,
  ) {
    const participant1 =
      await this.userRepository.findOne({
        where: {
          id: createConversationDto.participant1Id,
        },
      });

    const participant2 =
      await this.userRepository.findOne({
        where: {
          id: createConversationDto.participant2Id,
        },
      });

    if (!participant1 || !participant2) {
      throw new NotFoundException(
        'User not found',
      );
    }

    const conversation =
      new Conversation();

    conversation.participant1 =
      participant1;

    conversation.participant2 =
      participant2;

    return this.conversationRepository.save(
      conversation,
    );
  }

  findAll() {
    return this.conversationRepository.find();
  }

  findOne(id: string) {
    return this.conversationRepository.findOne({
      where: { id },
    });
  }

  async findByUser(
    userId: number,
  ) {
    return this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoinAndSelect(
        'conversation.participant1',
        'participant1',
      )
      .leftJoinAndSelect(
        'conversation.participant2',
        'participant2',
      )
      .where(
        'participant1.id = :userId',
        { userId },
      )
      .orWhere(
        'participant2.id = :userId',
        { userId },
      )
      .getMany();
  }
}