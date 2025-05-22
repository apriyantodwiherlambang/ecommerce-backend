// src/payments/dtos/create-payment.dto.ts

import { IsString, IsNumber } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  orderId: string;
}
