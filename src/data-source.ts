import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';
import * as dotenv from 'dotenv';
import { Category } from './categories/entities/category.entity';
import { Product } from './products/entities/product.entity';
import { CartItem } from './cart_items/entities/cart-item.entity';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/order-item.entity';
import { Notification } from './notifications/entities/notification.entity';
dotenv.config();

import { CreateUserTable1745993317726 } from './migrations/1745993317726-createUserTable';
import { CreateCategoryAndProduct1746206893591 } from './migrations/1746206893591-createCategoryAndProduct';
import { Migrations1746258127661 } from './migrations/1746258127661-migrations'; // Pastikan menggunakan nama yang benar
import { CartItemMigration1746341655549 } from './migrations/1746341655549-CartItemMigration';
import { CreateOrdersAndOrderItems1746347376623 } from './migrations/1746347376623-CreateOrdersAndOrderItems';
//import { UpdateOrderStructure1746355151881 } from './migrations/1746355151881-UpdateOrderStructure';
import { AddNotificationsTable1746362784118 } from './migrations/1746362784118-AddNotificationsTable';

console.log('Database config:', {
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [User, Category, Product, CartItem, Order, OrderItem, Notification],
  migrations: [
    CreateUserTable1745993317726,
    CreateCategoryAndProduct1746206893591,
    Migrations1746258127661, // Gunakan nama yang benar
    CartItemMigration1746341655549,
    CreateOrdersAndOrderItems1746347376623,
    // UpdateOrderStructure1746355151881,
    AddNotificationsTable1746362784118,
  ],
  synchronize: false,
});
