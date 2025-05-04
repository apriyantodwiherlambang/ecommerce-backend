import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CartItem } from '../entities/cart-item.entity';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { AddToCartDto } from '../dtos/add-to-cart.dto';
import { UpdateCartItemDto } from '../dtos/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager, // Menggunakan EntityManager
  ) {}

  // Menambahkan produk ke keranjang
  async addToCart(userId: string, dto: AddToCartDto): Promise<any> {
    const userIdNumber = +userId;
    const productIdString = dto.productId;

    const user = await this.entityManager.findOneOrFail(User, {
      where: { id: userIdNumber },
    });

    const product = await this.entityManager.findOneOrFail(Product, {
      where: { id: productIdString },
    });

    // Cek jika produk sudah ada dalam keranjang user
    let item = await this.entityManager.findOne(CartItem, {
      where: { user: { id: userIdNumber }, product: { id: productIdString } },
    });

    if (item) {
      // Jika item sudah ada, update quantity
      item.quantity += dto.quantity;
    } else {
      // Jika item belum ada, buat item baru
      item = this.entityManager.create(CartItem, {
        user,
        product,
        quantity: dto.quantity,
      });
    }

    const savedItem = await this.entityManager.save(item); // Menyimpan data
    return {
      message: 'Product added to cart successfully',
      data: savedItem,
    };
  }

  // Mendapatkan keranjang user
  async getUserCart(userId: string): Promise<any> {
    const items = await this.entityManager.find(CartItem, {
      where: { user: { id: +userId } },
      relations: ['product'],
    });

    return {
      message: 'User cart fetched successfully',
      data: items,
    };
  }

  // Mengupdate kuantitas item dalam keranjang
  async updateItemQuantity(
    itemId: string,
    dto: UpdateCartItemDto,
    userId: string,
  ): Promise<any> {
    const item = await this.entityManager.findOneOrFail(CartItem, {
      where: { id: itemId },
      relations: ['user'],
    });

    if (item.user.id !== +userId) {
      throw new UnauthorizedException();
    }

    item.quantity = dto.quantity;
    const updatedItem = await this.entityManager.save(item);

    return {
      message: 'Cart item updated successfully',
      data: updatedItem,
    };
  }

  // Menghapus item dari keranjang
  async removeItem(itemId: string, userId: string): Promise<any> {
    const item = await this.entityManager.findOneOrFail(CartItem, {
      where: { id: itemId },
      relations: ['user'],
    });

    if (item.user.id !== +userId) {
      throw new UnauthorizedException();
    }

    await this.entityManager.remove(item);
    return {
      message: 'Cart item removed successfully',
    };
  }

  // Menghapus semua item dalam keranjang
  async clearCart(userId: string): Promise<any> {
    await this.entityManager.delete(CartItem, {
      user: { id: +userId },
    });
    return {
      message: 'All cart items cleared successfully',
    };
  }
}
