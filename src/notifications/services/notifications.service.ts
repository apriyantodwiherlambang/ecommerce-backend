// src/notifications/services/notifications.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { CreateNotificationDto } from '../dtos/create-notification.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Fungsi untuk membuat notifikasi
  async createNotification(
    dto: Omit<CreateNotificationDto, 'userId'>,
    userId: number,
  ): Promise<Notification> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const notification = this.notificationRepository.create({
      message: dto.message,
      type: dto.type,
      orderId: dto.orderId,
      user,
    });

    return this.notificationRepository.save(notification);
  }

  // Fungsi untuk menandai notifikasi sebagai dibaca
  async markAsRead(id: string, userId: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: {
        id, // ID notifikasi adalah string
        user: { id: userId }, // ID user harus bertipe number
      },
      relations: ['user'], // Pastikan relasi user dimuat
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    notification.read = true;
    return this.notificationRepository.save(notification);
  }
}
