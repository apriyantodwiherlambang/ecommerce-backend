// src/orders/controllers/order.controller.ts

import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { OrderService } from '../services/orders.service';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { Request } from 'express';
import { NotificationService } from 'src/notifications/services/notifications.service';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly notificationService: NotificationService, // Inject NotificationService
  ) {}

  @Post()
  async createOrder(@Body() dto: CreateOrderDto, @Req() req: Request) {
    const { user } = req;
    const userId = user.id;

    // Create order first
    const response = await this.orderService.createOrder(userId, dto);
    const order = response.order; // Ambil objek order dari response

    // Trigger notification after order is created
    await this.notificationService.createNotification(
      {
        message: `Order with ID ${order.id} has been successfully created.`,
        type: 'order',
        orderId: order.id, // optional, kalau orderId kamu ingin relasikan
      },
      userId, // <- ini argumen kedua
    );

    return response; // Return the full response, including the order and message
  }

  @Get('my-orders')
  async getMyOrders(@Req() req: Request) {
    const userId = req.user.id;
    return this.orderService.getOrdersByUser(userId);
  }
}
