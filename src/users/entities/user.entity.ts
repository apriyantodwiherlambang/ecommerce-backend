import { Product } from '../../products/entities/product.entity';
import { CartItem } from '../../cart_items/entities/cart-item.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Notification } from 'src/notifications/entities/notification.entity'; // Import Notification entity
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  profileImage: string; // Store image path as string (instead of Buffer)

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  profileImageMimeType: string; // Menambahkan MIME type untuk gambar profil

  @Column({ default: 'user' })
  role: string;

  @Column({ nullable: true })
  refreshToken: string;

  @OneToMany(() => Product, (product) => product.createdBy)
  products: Product[]; // Relasi untuk produk yang dibuat oleh user (admin)

  @OneToMany(() => CartItem, (cartItem) => cartItem.user)
  cartItems: CartItem[];

  // Relasi OneToMany dengan Order
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[]; // Relasi untuk mendapatkan daftar notifikasi terkait user
}
