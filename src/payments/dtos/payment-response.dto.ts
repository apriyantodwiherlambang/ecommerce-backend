// src/payments/dtos/payment-response.dto.ts

import { IsString } from 'class-validator';

export class PaymentResponseDto {
  @IsString()
  redirect_url: string;

  // Jika ada data lain yang ingin diambil dari response Midtrans, kamu bisa menambahkannya
  // Misalnya status transaksi, order_id, atau lainnya.
}
