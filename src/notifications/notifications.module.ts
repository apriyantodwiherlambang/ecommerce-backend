// src/notifications/notifications.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsController } from './controllers/notifications.controller';
import { NotificationService } from './services/notifications.service';
import { Notification } from './entities/notification.entity'; // Import Notification Entity
import { User } from 'src/users/entities/user.entity'; // Import User Entity
import { Order } from 'src/orders/entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, User, Order]), // Import Notification and User repositories
  ],
  controllers: [NotificationsController], // Register NotificationController
  providers: [NotificationService], // Register NotificationService
  exports: [NotificationService],
})
export class NotificationModule {}
