// src/products/products.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from 'src/categories/entities/category.entity';
import { ProductsController } from './controllers/products.controller';
import { ProductsService } from './services/products.service';
import { OrderItem } from 'src/orders/entities/order-item.entity';
import { Order } from 'src/orders/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, OrderItem, Order])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
