// src/orders/orders.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderService } from './services/orders.service';
import { OrderController } from './controllers/orders.controller';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { CartItem } from 'src/cart_items/entities/cart-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, CartItem, Product, User]),
  ],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrdersModule {}
