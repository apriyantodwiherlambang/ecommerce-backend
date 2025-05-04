// src/orders/dtos/create-order.dto.ts

import {
  IsArray,
  IsNotEmpty,
  IsString,
  ArrayNotEmpty,
  IsUUID,
} from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  shippingAddress: string;

  @IsString()
  @IsNotEmpty()
  paymentMethod: string; // misalnya: 'credit_card', 'bank_transfer', dll.

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  cartItems: {
    productId: string;
    quantity: number;
  }[]; // Cart items yang dipilih untuk di-order
}
