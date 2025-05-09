import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from '../../orders/entities/order-item.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('integer')
  price: number;

  @Column()
  image: string;

  @Column()
  stock: number;

  @ManyToOne(() => Category, (category) => category.products, { eager: false })
  category: Category;

  @Column()
  categoryId: string;

  @ManyToOne(() => User, (user) => user.products, { eager: false })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column()
  createdById: number;

  // Relasi OneToMany dengan OrderItem
  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];
}
