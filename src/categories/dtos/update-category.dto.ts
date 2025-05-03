// src/categories/dtos/update-category.dto.ts

import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string; // Nama kategori
}
