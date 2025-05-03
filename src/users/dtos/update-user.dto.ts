import {
  IsOptional,
  IsString,
  IsPhoneNumber,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';

export class UpdateUserDto {
  userId: number;

  @IsOptional()
  @IsPhoneNumber(null, { message: 'Phone number is invalid' })
  @IsNotEmpty({ message: 'Phone number cannot be empty' })
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Address should not exceed 255 characters' })
  @IsNotEmpty({ message: 'Address cannot be empty' })
  address?: string;
}
