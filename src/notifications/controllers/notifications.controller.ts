import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { NotificationService } from '../services/notifications.service';
import { CreateNotificationDto } from '../dtos/create-notification.dto';
import { Notification } from '../entities/notification.entity';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationService: NotificationService) {}

  // Endpoint untuk membuat notifikasi (otomatis ambil user dari token)
  @Post()
  async createNotification(
    @Body() createNotificationDto: Omit<CreateNotificationDto, 'userId'>,
    @Req() req: Request,
  ): Promise<Notification> {
    const user = req.user;
    return this.notificationService.createNotification(
      createNotificationDto,
      user.id,
    );
  }

  // Endpoint untuk menandai notifikasi sebagai dibaca
  @Patch(':id/mark-as-read')
  async markAsRead(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<Notification> {
    const user = req.user;
    return this.notificationService.markAsRead(id, user.id);
  }
}
