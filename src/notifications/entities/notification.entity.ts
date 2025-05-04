// src/notifications/entities/notification.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity'; // Relasi dengan User

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  message: string;

  @Column()
  type: string; // Jenis notifikasi (misalnya: 'order', 'payment', dsb)

  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'userId' }) // Relasi dengan user
  user: User;

  @Column({ default: false })
  read: boolean; // Flag untuk menandai apakah notifikasi sudah dibaca

  @Column({ nullable: true })
  orderId: string; // Relasi dengan orderId jika ada
}
