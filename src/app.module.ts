import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './database/typeorm.config'; // pastikan path sesuai
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { CartModule } from './cart_items/cart-items.module';
import { OrdersModule } from './orders/orders.module';
import { NotificationModule } from './notifications/notifications.module';
import { PaymentsModule } from './payments/payments.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ConfigModule.forRoot({ isGlobal: true }),

    // Serve static files dari folder 'uploads' dengan prefix URL '/uploads'
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    UsersModule,
    AdminModule,
    ProductsModule,
    CategoriesModule,
    CartModule,
    OrdersModule,
    NotificationModule,
    PaymentsModule,
  ],
})
export class AppModule {}
