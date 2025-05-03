// src/products/dtos/create-product.dto.ts

import { IsString, IsNumber, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @IsNotEmpty()
  @IsString()
  image: string; // Pastikan image_url harus ada
}
