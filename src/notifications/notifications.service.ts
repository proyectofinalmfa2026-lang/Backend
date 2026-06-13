import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Notification } from './entities/notifications.entity';
import { User } from '../users/entities/users.entity';

import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationsGateway } from './notifications.gateway';
import { MailService } from '../mail/mail.service';

@Injectable()
export class NotificationsService {
  constructor(
  @InjectRepository(Notification)
  private readonly notificationRepository: Repository<Notification>,

  @InjectRepository(User)
  private readonly userRepository: Repository<User>,

  private readonly notificationsGateway: NotificationsGateway,

  private readonly mailService: MailService,
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

    const savedNotification =
  await this.notificationRepository.save(
    notification,
  );

if (this.notificationsGateway.server) {
  this.notificationsGateway.server.emit(
    'notification',
    savedNotification,
  );
}

await this.mailService.sendNotificationEmail(
  user.email,
  notification.title,
  notification.message,
);

return savedNotification;
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

  async findByUser(userId: number) {
  return this.notificationRepository.find({
    where: {
      user: {
        id: userId,
      },
    },
    relations: {
      user: true,
    },
    order: {
      createdAt: 'DESC',
    },
  });
}

async markAsRead(id: string) {
  const notification =
    await this.notificationRepository.findOne({
      where: { id },
    });

  if (!notification) {
    throw new NotFoundException(
      'Notification not found',
    );
  }

  notification.isRead = true;

  return this.notificationRepository.save(
    notification,
  );
}
}