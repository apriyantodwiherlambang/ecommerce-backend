import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsString()
  type: string; // Jenis notifikasi

  @IsOptional()
  @IsString()
  orderId?: string; // Opsional, untuk relasi dengan orderId
}
