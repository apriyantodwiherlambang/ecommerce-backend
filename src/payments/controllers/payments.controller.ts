import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Headers,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PaymentService } from '../services/payments.service';
import { CreatePaymentDto } from '../dtos/create-payments.dto';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Controller('payments')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly configService: ConfigService,
  ) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createTransaction(
    @Body() createPaymentDto: CreatePaymentDto,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    try {
      return await this.paymentService.createTransaction(
        createPaymentDto,
        userId,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Post('webhook')
  async handlePaymentNotification(
    @Body() notificationPayload: any,
    @Headers('x-signature') signature: string,
  ) {
    const secretKey = this.configService.get('MIDTRANS_SERVER_KEY');

    const { order_id, status_code, gross_amount, signature_key } =
      notificationPayload;

    const expectedSignature = crypto
      .createHash('sha512')
      .update(order_id + status_code + gross_amount + secretKey)
      .digest('hex');

    if (signature_key !== expectedSignature) {
      console.error('Invalid signature');
      throw new HttpException('Invalid signature', HttpStatus.FORBIDDEN);
    }

    try {
      await this.paymentService.processPaymentNotification(notificationPayload);
      return { message: 'OK' }; // ✅ ini yang penting supaya Midtrans tahu berhasil
    } catch (error) {
      console.error('Error processing webhook:', error.message);
      // Tetap return 200 agar Midtrans tidak retry
      return { message: 'Error occurred, but handled', error: error.message };
    }
  }
}
