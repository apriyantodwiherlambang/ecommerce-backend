import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  Patch,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CartService } from '../services/cart-items.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AddToCartDto } from '../dtos/add-to-cart.dto';
import { UpdateCartItemDto } from '../dtos/update-cart-item.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async addItem(@Body() dto: AddToCartDto, @Req() req) {
    const response = await this.cartService.addToCart(req.user.id, dto);
    return response; // Menyampaikan response dari service
  }

  @Get()
  async getCart(@Req() req) {
    const response = await this.cartService.getUserCart(req.user.id);
    return response; // Menyampaikan response dari service
  }

  @Patch(':id')
  async updateItemQuantity(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCartItemDto,
    @Req() req,
  ) {
    const response = await this.cartService.updateItemQuantity(
      id,
      dto,
      req.user.id,
    );
    return response; // Menyampaikan response dari service
  }

  @Delete(':id')
  async removeItem(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
    const response = await this.cartService.removeItem(id, req.user.id);
    return response; // Menyampaikan response dari service
  }

  @Delete()
  async clearCart(@Req() req) {
    const response = await this.cartService.clearCart(req.user.id);
    return response; // Menyampaikan response dari service
  }
}
