import {
  IsOptional,
  IsString,
  IsPhoneNumber,
  MaxLength,
  IsEmail,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email is invalid' })
  email?: string;

  @IsOptional()
  @IsPhoneNumber(null, { message: 'Phone number is invalid' })
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Address should not exceed 255 characters' })
  address?: string;
}
