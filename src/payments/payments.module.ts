import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentService } from './services/payments.service';
import { PaymentController } from './controllers/payments.controller';
import { PaymentGateway } from './gateways/payments.gateway';

import { User } from 'src/users/entities/user.entity';
import { Order } from 'src/orders/entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Order]), // ✅ agar bisa inject repository
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [PaymentService, PaymentGateway],
  controllers: [PaymentController],
})
export class PaymentsModule {}
