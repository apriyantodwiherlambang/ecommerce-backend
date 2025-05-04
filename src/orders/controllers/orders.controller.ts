// src/orders/controllers/order.controller.ts

import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { OrderService } from '../services/orders.service';
import { CreateOrderDto } from '../dtos/create-order.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard) // Guard untuk memastikan hanya user yang terautentikasi yang dapat membuat order
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() dto: CreateOrderDto, @Req() req) {
    const userId = req.user.id; // Ambil userId dari token JWT yang ada di request
    const response = await this.orderService.createOrder(userId, dto);
    return response;
  }
}
