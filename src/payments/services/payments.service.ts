import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePaymentDto } from '../dtos/create-payments.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { Order } from 'src/orders/entities/order.entity';
import { PaymentGateway } from '../gateways/payments.gateway';

@Injectable()
export class PaymentService {
  private readonly MIDTRANS_SERVER_KEY: string;
  private readonly MIDTRANS_URL: string =
    'https://api.sandbox.midtrans.com/v2/charge';

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    private readonly paymentGateway: PaymentGateway,
  ) {
    this.MIDTRANS_SERVER_KEY = this.configService.get<string>(
      'MIDTRANS_SERVER_KEY',
    );
  }

  async createTransaction(createPaymentDto: CreatePaymentDto, userId: number) {
    const { orderId } = createPaymentDto; // string

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product'],
    });
    if (!order) throw new Error('Order not found');

    const itemDetails = order.items.map((item) => ({
      id: item.product.id.toString(),
      name: item.product.name,
      quantity: item.quantity,
      price: Number(item.price),
    }));

    const totalPrice = itemDetails.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const payload = {
      payment_type: 'bank_transfer',
      transaction_details: {
        order_id: orderId,
        gross_amount: totalPrice,
      },
      customer_details: {
        first_name: user.username,
        email: user.email,
        phone: user.phoneNumber,
        billing_address: {
          first_name: user.username,
          phone: user.phoneNumber,
          address: user.address,
          city: 'Jakarta',
          postal_code: '12345',
          country_code: 'IDN',
        },
        shipping_address: {
          first_name: user.username,
          phone: user.phoneNumber,
          address: order.shippingAddress,
          city: 'Jakarta',
          postal_code: '12345',
          country_code: 'IDN',
        },
      },
      item_details: itemDetails,
      bank_transfer: {
        bank: 'bca',
      },
    };

    const response = await axios.post(this.MIDTRANS_URL, payload, {
      headers: {
        Authorization: `Basic ${Buffer.from(
          this.MIDTRANS_SERVER_KEY + ':',
        ).toString('base64')}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  }

  async processPaymentNotification(notificationPayload: any) {
    const { order_id, transaction_status } = notificationPayload;

    const orderId: string = order_id.toString(); // pastikan string

    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    if (!order) throw new Error('Order not found');

    if (transaction_status === 'settlement') {
      order.status = 'Paid';
    } else if (transaction_status === 'pending') {
      order.status = 'Pending';
    } else if (transaction_status === 'cancel') {
      order.status = 'Cancelled';
    } else if (transaction_status === 'failure') {
      order.status = 'Failed';
    }

    await this.orderRepository.save(order);

    // Emit status via WebSocket
    this.paymentGateway.sendPaymentStatusUpdate({
      orderId: order.id, // string
      status: order.status,
    });

    return { message: 'Notification processed successfully' };
  }
}
