// src/orders/services/order.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { CartItem } from 'src/cart_items/entities/cart-item.entity';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createOrder(userId: number, dto: CreateOrderDto) {
    // Ambil user berdasarkan userId
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    // Ambil cart items milik user
    const cartItems = await this.cartItemRepository.find({
      where: {
        user: user, // Gunakan objek user langsung
      },
      relations: ['product'],
    });

    // Jika tidak ada item di cart
    if (cartItems.length === 0) {
      throw new Error('No items in cart');
    }

    // Hitung total harga order
    const totalPrice = cartItems.reduce((sum, cartItem) => {
      return sum + cartItem.product.price * cartItem.quantity;
    }, 0);

    // Membuat order baru dan tetapkan status default
    const order = this.orderRepository.create({
      user,
      shippingAddress: dto.shippingAddress,
      paymentMethod: dto.paymentMethod,
      totalPrice, // Set totalPrice
      status: 'Pending', // Set status default
    });

    await this.orderRepository.save(order);

    // Menambahkan order item
    const orderItems = cartItems.map((cartItem) => {
      const orderItem = this.orderItemRepository.create({
        product: cartItem.product,
        quantity: cartItem.quantity,
        price: cartItem.product.price, // Ambil harga produk
        order,
      });
      return orderItem;
    });

    await this.orderItemRepository.save(orderItems);

    // Hapus cart setelah order selesai
    await this.cartItemRepository.delete({ user: user });

    return {
      message: 'Order created successfully',
      order,
    };
  }
}
