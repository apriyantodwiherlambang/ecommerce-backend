import { Product } from '../../products/entities/product.entity';
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
}
