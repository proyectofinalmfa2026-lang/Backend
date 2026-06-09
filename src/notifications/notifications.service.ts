import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Notification } from './entities/notifications.entity';
import { User } from '../users/entities/users.entity';

import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto,
  ) {
    const user = await this.userRepository.findOne({
      where: {
        id: createNotificationDto.userId,
      },
    });

    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }

    const notification = new Notification();

    notification.title =
      createNotificationDto.title;

    notification.message =
      createNotificationDto.message;

    notification.user = user;

    return this.notificationRepository.save(
      notification,
    );
  }

  findAll() {
    return this.notificationRepository.find({
      relations: {
        user: true,
      },
    });
  }

  findOne(id: string) {
    return this.notificationRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });
  }

  remove(id: string) {
    return this.notificationRepository.delete(id);
  }
}