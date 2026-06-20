import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';

import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  @Post()
@UseGuards(JwtAuthGuard)
create(
    @Body()
    createNotificationDto: CreateNotificationDto,
  ) {
    return this.notificationsService.create(
      createNotificationDto,
    );
  }

  @Get()
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Get('/user/:userId')
findByUser(
  @Param('userId', ParseIntPipe)
  userId: number,
) {
  return this.notificationsService.findByUser(
    userId,
  );
}

@Patch(':id/read')
@UseGuards(JwtAuthGuard)
markAsRead(
  @Param('id') id: string,
) {
  return this.notificationsService.markAsRead(
    id,
  );
}

  @Delete(':id')
@UseGuards(JwtAuthGuard)
remove(@Param('id') id: string) {
    return this.notificationsService.remove(id);
  }

  @Post('test-email')
@UseGuards(JwtAuthGuard)
async testEmail() {
  return this.notificationsService.create({
    userId: 7, // tu usuario de prueba
    title: 'Prueba de Email',
    message: 'Si recibiste este correo, Gmail SMTP funciona correctamente.',
  });
}
}